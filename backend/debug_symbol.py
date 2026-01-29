from nselib import capital_market
from datetime import datetime, timedelta
import pandas as pd

def debug_symbol(symbol):
    # Try the last 10 days
    found = False
    for i in range(10):
        dt = datetime.now() - timedelta(days=i)
        date_str = dt.strftime('%d-%m-%Y')
        try:
            bhav = capital_market.bhav_copy_equities(date_str)
            if bhav.empty:
                continue
            
            row = bhav[bhav['TckrSymb'] == symbol]
            if not row.empty:
                print(f"--- Found {symbol} for {date_str} ---")
                data = row.to_dict('records')[0]
                for k, v in data.items():
                    print(f"{k}: {v}")
                found = True
                break
        except Exception:
            continue
    
    if not found:
        print(f"Symbol {symbol} not found in the last 10 days in Equities bhavcopy")

if __name__ == "__main__":
    debug_symbol('1003IIFL29')
