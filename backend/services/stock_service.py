import pandas as pd
from nselib import capital_market, derivatives
from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple
import logging
import os
from models.stock import StockData

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class StockService:
    def __init__(self):
        self._cache = {} # date_str -> List[Dict]
        self._cache_expiry = {} # date_str -> datetime
        self._historical_anchors = {} 
        self._last_historical_fetch = None

    def _get_trading_date_offset(self, days_back: int) -> str:
        dt = datetime.now() - timedelta(days=days_back)
        if dt.weekday() == 5: dt -= timedelta(days=1)
        elif dt.weekday() == 6: dt -= timedelta(days=2)
        return dt.strftime('%d-%m-%Y')

    def _fetch_historical_anchor(self, days_back: int = 365):
        today = datetime.now().strftime('%Y-%m-%d')
        if self._last_historical_fetch == today and self._historical_anchors:
            return self._historical_anchors

        target_date = self._get_trading_date_offset(days_back)
        try:
            for i in range(5):
                fetch_dt = (datetime.strptime(target_date, '%d-%m-%Y') - timedelta(days=i)).strftime('%d-%m-%Y')
                hist_bhav = capital_market.bhav_copy_equities(fetch_dt)
                if not hist_bhav.empty:
                    self._historical_anchors = hist_bhav.set_index('TckrSymb')['ClsPric'].to_dict()
                    self._last_historical_fetch = today
                    return self._historical_anchors
            return {}
        except Exception:
            return {}

    def _categorize_instrument(self, row: pd.Series) -> str:
        tp = str(row.get('FinInstrmTp', '')).upper()
        srs = str(row.get('SctySrs', '')).upper()
        if tp in ['STO', 'IDO']: return "Option"
        if tp in ['STF', 'IDF']: return "Future"
        if tp == 'STK':
            if srs in ['EQ', 'BE', 'BZ', 'SM', 'ST']: return "Stock"
            if srs.startswith('N') or srs.startswith('Y') or srs == 'GB': return "Debenture"
            return "Stock"
        return "Other"

    def _get_full_market_data(self) -> List[Dict[str, Any]]:
        """Internal helper to get the full processed dataset (cached)."""
        now = datetime.now()
        
        # 1. Find latest valid trading date
        start_date = self._get_latest_trading_date()
        date_obj = datetime.strptime(start_date, '%d-%m-%Y')
        
        valid_date_str = None
        for i in range(5):
            target_date = (date_obj - timedelta(days=i)).strftime('%d-%m-%Y')
            if target_date in self._cache and now < self._cache_expiry.get(target_date, now):
                return self._cache[target_date]
            
            try:
                # Use a lightweight check if possible, or just try fetching bhavcopy
                bhavcopy = capital_market.bhav_copy_equities(target_date)
                if not bhavcopy.empty:
                    valid_date_str = target_date
                    break
            except Exception:
                continue

        if not valid_date_str:
            return []

        # 2. Fetch and merge full data
        try:
            bhavcopy = capital_market.bhav_copy_equities(valid_date_str)
            _, detail_df = capital_market.total_traded_stocks()
            try:
                pe_df = capital_market.pe_ratio(valid_date_str)
            except Exception:
                pe_df = pd.DataFrame(columns=['SYMBOL', 'SYMBOLP/E'])
            equity_list = capital_market.equity_list()
            
            try:
                fno_bhav = derivatives.fno_bhav_copy(valid_date_str)
            except Exception:
                fno_bhav = pd.DataFrame()

            combined = pd.concat([bhavcopy, fno_bhav], ignore_index=True)
            merged = pd.merge(combined, detail_df[['symbol', 'totalMarketCap', 'issuedCap']], left_on='TckrSymb', right_on='symbol', how='left')
            merged = pd.merge(merged, pe_df[['SYMBOL', 'SYMBOLP/E']], left_on='TckrSymb', right_on='SYMBOL', how='left')
            merged = pd.merge(merged, equity_list[['SYMBOL', 'NAME OF COMPANY']], left_on='TckrSymb', right_on='SYMBOL', suffixes=('', '_m'), how='left')
            
            if not merged.empty:
                # Deduplicate: Prioritize 'Stock' instrument type
                merged['instrument_rank'] = merged['FinInstrmTp'].apply(lambda x: 0 if str(x).upper() == 'STK' else 1)
                merged = merged.sort_values(by=['TckrSymb', 'instrument_rank'])
                merged = merged.drop_duplicates(subset=['TckrSymb'], keep='first')

            hist_prices = self._fetch_historical_anchor(365)
            stocks = []
            for _, row in merged.iterrows():
                try:
                    symbol = str(row['TckrSymb'])
                    mkt_cap = row.get('totalMarketCap')
                    last_price = float(row['LastPric'])
                    prev_close = float(row['PrvsClsgPric'])
                    
                    if (pd.isna(mkt_cap) or mkt_cap == 0) and pd.notnull(row.get('issuedCap')):
                        mkt_cap = (last_price * float(row['issuedCap'])) / 10**7

                    return_1y = None
                    hist_p = hist_prices.get(symbol)
                    if hist_p and float(hist_p) > 0:
                        return_1y = round(((last_price - float(hist_p)) / float(hist_p)) * 100, 2)

                    stock_dict = {
                        "symbol": symbol,
                        "name": str(row['NAME OF COMPANY']) if pd.notnull(row['NAME OF COMPANY']) else symbol,
                        "last_price": last_price,
                        "close_price": float(row['ClsPric']),
                        "open_price": float(row['OpnPric']),
                        "high_price": float(row['HghPric']),
                        "low_price": float(row['LwPric']),
                        "prev_close": prev_close,
                        "volume": int(row['TtlTradgVol']),
                        "market_cap": float(mkt_cap) if pd.notnull(mkt_cap) else None,
                        "pe_ratio": float(row['SYMBOLP/E']) if pd.notnull(row.get('SYMBOLP/E')) and row['SYMBOLP/E'] != '-' else None,
                        "p_change": round(((last_price - prev_close) / prev_close * 100), 2) if prev_close else 0,
                        "return_1y": return_1y,
                        "instrument_type": self._categorize_instrument(row)
                    }
                    validated = StockData(**stock_dict)
                    stocks.append(validated.model_dump())
                except Exception:
                    continue
            
            # Cache full dataset
            self._cache[valid_date_str] = stocks
            cache_timeout = int(os.getenv('CACHE_TIMEOUT', 300))
            self._cache_expiry[valid_date_str] = now + timedelta(seconds=cache_timeout)
            return stocks
        except Exception as e:
            logger.error(f"Error in data acquisition: {e}")
            return []

    def fetch_all_stocks(self, sort_by: str = None, sort_order: str = 'asc', limit: int = 50) -> List[Dict[str, Any]]:
        full_data = self._get_full_market_data()
        return self._process_sorting_and_limit(full_data, sort_by, sort_order, limit)

    def screen_stocks(self, criteria: Dict[str, Any], sort_by: str = None, sort_order: str = 'asc', limit: int = 50) -> List[Dict[str, Any]]:
        full_data = self._get_full_market_data()
        if not full_data: return []

        filtered = []
        for stock in full_data:
            mkt_cap = stock.get('market_cap')
            if criteria.get('min_market_cap') is not None:
                if mkt_cap is None or mkt_cap < criteria['min_market_cap']: continue
            if criteria.get('max_market_cap') is not None:
                if mkt_cap is None or mkt_cap > criteria['max_market_cap']: continue

            pe = stock.get('pe_ratio')
            if criteria.get('min_pe') is not None:
                if pe is None or pe < criteria['min_pe']: continue
            if criteria.get('max_pe') is not None:
                if pe is None or pe > criteria['max_pe']: continue

            ret_1y = stock.get('return_1y')
            if criteria.get('min_return_1y') is not None:
                if ret_1y is None or ret_1y < criteria['min_return_1y']: continue

            filtered.append(stock)

        return self._process_sorting_and_limit(filtered, sort_by, sort_order, limit)

    def _process_sorting_and_limit(self, stocks: List[Dict[str, Any]], sort_by: str = None, sort_order: str = 'asc', limit: int = 50) -> List[Dict[str, Any]]:
        result = stocks.copy()
        
        if sort_by and sort_by in ['symbol', 'name', 'last_price', 'market_cap', 'pe_ratio', 'p_change', 'return_1y', 'volume']:
            # Filter out nulls for the metric (Pure Stream) - except for string fields where we might want empty ones at the bottom (but user said "don't see them on either end")
            # For metrics, we filter out None. For string fields, we filter out None or empty.
            if sort_by in ['symbol', 'name']:
                result = [s for s in result if s.get(sort_by) is not None and str(s.get(sort_by)).strip() != ""]
            else:
                result = [s for s in result if s.get(sort_by) is not None]
            
            reverse = (sort_order == 'desc')
            if sort_by in ['symbol', 'name']:
                result.sort(key=lambda x: str(x.get(sort_by)).lower(), reverse=reverse)
            else:
                result.sort(key=lambda x: x.get(sort_by), reverse=reverse)
        
        return result[:limit]

    def get_total_count(self) -> int:
        full_data = self._get_full_market_data()
        return len(full_data)

    def get_filtered_count(self, criteria: Dict[str, Any]) -> int:
        full_data = self._get_full_market_data()
        if not full_data: return 0
        
        count = 0
        for stock in full_data:
            mkt_cap = stock.get('market_cap')
            if criteria.get('min_market_cap') is not None:
                if mkt_cap is None or mkt_cap < criteria['min_market_cap']: continue
            if criteria.get('max_market_cap') is not None:
                if mkt_cap is None or mkt_cap > criteria['max_market_cap']: continue
            pe = stock.get('pe_ratio')
            if criteria.get('min_pe') is not None:
                if pe is None or pe < criteria['min_pe']: continue
            if criteria.get('max_pe') is not None:
                if pe is None or pe > criteria['max_pe']: continue
            ret_1y = stock.get('return_1y')
            if criteria.get('min_return_1y') is not None:
                if ret_1y is None or ret_1y < criteria['min_return_1y']: continue
            count += 1
        return count

    def _get_latest_trading_date(self) -> str:
        dt = datetime.now()
        if dt.weekday() == 5: dt -= timedelta(days=1)
        elif dt.weekday() == 6: dt -= timedelta(days=2)
        return dt.strftime('%d-%m-%Y')

stock_service = StockService()
