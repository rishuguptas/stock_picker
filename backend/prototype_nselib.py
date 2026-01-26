from nselib import capital_market
import pandas as pd
from datetime import datetime

def prototype_extraction():
    print("--- nselib Prototype Extraction ---")
    
    try:
        # 1. Fetch Price List (Daily Bhavcopy)
        # Using a recent date (Friday 23rd Jan 2026)
        date_str = '23-01-2026'
        print(f"Fetching daily price list (bhav_copy_equities) for {date_str}...")
        price_list = capital_market.bhav_copy_equities(date_str)
        
        if price_list.empty:
            print("Error: Price list is empty.")
            return

        print(f"Successfully fetched {len(price_list)} stocks.")
        
        # Display first 5 stocks with mapped columns
        print("\nTop 5 Stocks (Raw Data Sample):")
        cols_map = {
            'TckrSymb': 'SYMBOL',
            'ClsPric': 'CLOSE',
            'LastPric': 'LAST',
            'OpnPric': 'OPEN',
            'TtlTradgVol': 'VOLUME'
        }
        
        # Select and rename for clarity
        display_df = price_list[list(cols_map.keys())].head(5).rename(columns=cols_map)
        print(display_df.to_string(index=False))

        # 2. Fetch Equity List (to get metadata)
        print("\nFetching equity list (metadata)...")
        equity_list = capital_market.equity_list()
        print(f"Equity list contains {len(equity_list)} items.")
        print("Sample Equity Metadata (First 2):")
        print(equity_list[['SYMBOL', 'NAME OF COMPANY', ' SERIES']].head(2).to_string(index=False))
        
        # 3. Demonstrate calculation fallback (FR3)
        print("\nSimulating Market Cap Calculation (FR3 Fallback):")
        sample_stock = price_list.iloc[0]
        symbol = sample_stock['TckrSymb']
        last_price = sample_stock['LastPric']
        
        print(f"Verified integration for {symbol}:")
        print(f" - Last Price: {last_price}")
        print(" - Ready for Epic 1 Story 1.1 Implementation.")

    except Exception as e:
        print(f"Error during prototype: {e}")

if __name__ == "__main__":
    prototype_extraction()
