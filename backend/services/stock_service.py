import pandas as pd
from nselib import capital_market
from datetime import datetime, timedelta
from typing import List, Dict, Any
import logging
import os
from models.stock import StockData

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class StockService:
    def __init__(self):
        self._cache = {}
        # Separate persistent cache for historical anchors (1Y ago)
        # Symbol -> Price
        self._historical_anchors = {} 
        self._last_historical_fetch = None

    def _get_trading_date_offset(self, days_back: int) -> str:
        """Find the nearest valid trading date roughly N days ago."""
        dt = datetime.now() - timedelta(days=days_back)
        # Weekends check
        if dt.weekday() == 5: dt -= timedelta(days=1)
        elif dt.weekday() == 6: dt -= timedelta(days=2)
        return dt.strftime('%d-%m-%Y')

    def _fetch_historical_anchor(self, days_back: int = 365):
        """Fetch and cache a full market snapshot from N days ago."""
        today = datetime.now().strftime('%Y-%m-%d')
        if self._last_historical_fetch == today and self._historical_anchors:
            return self._historical_anchors

        target_date = self._get_trading_date_offset(days_back)
        logger.info(f"Fetching historical anchor for {target_date}...")
        
        try:
            # We try up to 4 days back to find a valid trading day (account for holidays)
            for i in range(5):
                fetch_dt = (datetime.strptime(target_date, '%d-%m-%Y') - timedelta(days=i)).strftime('%d-%m-%Y')
                hist_bhav = capital_market.bhav_copy_equities(fetch_dt)
                if not hist_bhav.empty:
                    # Map Symbol -> Price
                    # Column TckrSymb is Symbol, ClsPric is Close
                    self._historical_anchors = hist_bhav.set_index('TckrSymb')['ClsPric'].to_dict()
                    self._last_historical_fetch = today
                    logger.info(f"Successfully cached {len(self._historical_anchors)} historical prices for {fetch_dt}")
                    return self._historical_anchors
            return {}
        except Exception as e:
            logger.error(f"Failed to fetch historical anchor: {e}")
            return {}

    def _categorize_instrument(self, row: pd.Series) -> str:
        """Map NSE metadata to Stock, Debenture, Option, or Future."""
        tp = str(row.get('FinInstrmTp', '')).upper()
        srs = str(row.get('SctySrs', '')).upper()
        
        if tp in ['STO', 'IDO']:
            return "Option"
        if tp in ['STF', 'IDF']:
            return "Future"
        
        # In Equities Bhavcopy
        if tp == 'STK':
            # Series EQ, BE, BZ, SM are usually stocks/SME
            if srs in ['EQ', 'BE', 'BZ', 'SM', 'ST']:
                return "Stock"
            # Series N1-N9, ND, Y1-Y9 are usually debt
            if srs.startswith('N') or srs.startswith('Y') or srs == 'GB':
                return "Debenture"
            return "Stock" # Default
            
        return "Other"

    def fetch_all_stocks(self, date_str: str = None) -> List[Dict[str, Any]]:
        """Fetch daily bhavcopy (with holiday retry) and return cached data."""
        
        # 1. Holiday Handling Loop
        start_date = date_str or self._get_latest_trading_date()
        date_obj = datetime.strptime(start_date, '%d-%m-%Y')
        
        # Try finding a valid date
        valid_date_str = None
        for i in range(5):
            target_date = (date_obj - timedelta(days=i)).strftime('%d-%m-%Y')
            
            # Check Cache
            now = datetime.now()
            if target_date in self._cache:
                data, expiry = self._cache[target_date]
                if now < expiry:
                    logger.debug(f"Returning cached data for {target_date}")
                    return data

            try:
                # Probe for data
                bhavcopy = capital_market.bhav_copy_equities(target_date)
                if not bhavcopy.empty:
                    valid_date_str = target_date
                    logger.info(f"Found valid trading data for {valid_date_str}")
                    break
            except Exception:
                pass
        
        if not valid_date_str:
            logger.error("Could not find any valid trading data in the last 5 days.")
            return []

        # 2. Fetch Dependent Data
        try:
            # We already have bhavcopy for valid_date_str from the loop above, but re-fetching to be safe/clean
            bhavcopy = capital_market.bhav_copy_equities(valid_date_str)
            _, detail_df = capital_market.total_traded_stocks()
            
            try:
                pe_df = capital_market.pe_ratio(valid_date_str)
            except Exception:
                pe_df = pd.DataFrame(columns=['SYMBOL', 'SYMBOLP/E'])

            equity_list = capital_market.equity_list()
            
            # 4. Fetch Derivatives (New: Story 2.2)
            from nselib import derivatives
            try:
                fno_bhav = derivatives.fno_bhav_copy(valid_date_str)
            except Exception:
                fno_bhav = pd.DataFrame()

            # 5. Merge Strategy - Combine Equities and Derivatives
            # Standardize columns if necessary (though they seem identical in nselib 1.0+)
            combined = pd.concat([bhavcopy, fno_bhav], ignore_index=True)
            
            # Merge with details (mainly for equities market cap)
            merged = pd.merge(combined, detail_df[['symbol', 'totalMarketCap', 'issuedCap']], left_on='TckrSymb', right_on='symbol', how='left')
            merged = pd.merge(merged, pe_df[['SYMBOL', 'SYMBOLP/E']], left_on='TckrSymb', right_on='SYMBOL', how='left')
            merged = pd.merge(merged, equity_list[['SYMBOL', 'NAME OF COMPANY']], left_on='TckrSymb', right_on='SYMBOL', suffixes=('', '_m'), how='left')
            
            # 6. Duplicate cleanup (Data is available now)
            if not merged.empty:
               merged = merged.drop_duplicates(subset=['TckrSymb', 'FinInstrmId'], keep='first')

            # 5. Process Stocks
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
            
            # Sort alphabetically by Symbol before caching
            stocks.sort(key=lambda x: x['symbol'])

            cache_timeout = int(os.getenv('CACHE_TIMEOUT', 300))
            self._cache[valid_date_str] = (stocks, datetime.now() + timedelta(seconds=cache_timeout))
            return stocks

        except Exception as e:
            logger.error(f"Error fetching/processing stocks: {e}")
            return []

    def screen_stocks(self, criteria: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Filter the stock list based on provided criteria."""
        all_stocks = self.fetch_all_stocks()
        if not all_stocks:
            return []

        filtered = []
        for stock in all_stocks:
            # 1. Market Cap Filter
            mkt_cap = stock.get('market_cap')
            if criteria.get('min_market_cap') is not None:
                if mkt_cap is None or mkt_cap < criteria['min_market_cap']: continue
            if criteria.get('max_market_cap') is not None:
                if mkt_cap is None or mkt_cap > criteria['max_market_cap']: continue

            # 2. P/E Ratio Filter
            pe = stock.get('pe_ratio')
            if criteria.get('min_pe') is not None:
                if pe is None or pe < criteria['min_pe']: continue
            if criteria.get('max_pe') is not None:
                if pe is None or pe > criteria['max_pe']: continue

            # 3. 1-Year Return Filter
            ret_1y = stock.get('return_1y')
            if criteria.get('min_return_1y') is not None:
                if ret_1y is None or ret_1y < criteria['min_return_1y']: continue

            filtered.append(stock)

        logger.info(f"Screening results: {len(filtered)} out of {len(all_stocks)} stocks match criteria.")
        return filtered

    def _get_latest_trading_date(self) -> str:
        """Helper to get a valid recent trading date (approximate)."""
        dt = datetime.now()
        if dt.weekday() == 5: dt -= timedelta(days=1)
        elif dt.weekday() == 6: dt -= timedelta(days=2)
        return dt.strftime('%d-%m-%Y')

# Singleton instance
stock_service = StockService()
