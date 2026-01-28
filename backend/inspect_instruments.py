from nselib import capital_market, derivatives
from datetime import datetime, timedelta
import pandas as pd

def inspect_data():
    # Use a recent weekday (avoiding Jan 26-28 as they might be holidays/weekends)
    # Let's try Jan 23, 2026 (Friday)
    date_str = '23-01-2026'
    
    print(f"--- Inspecting Equities for {date_str} ---")
    try:
        eq = capital_market.bhav_copy_equities(date_str)
        cols = ['FinInstrmTp', 'FinInstrmNm', 'SctySrs', 'Sgmt']
        for col in cols:
            if col in eq.columns:
                print(f"Equities {col} Unique:", eq[col].unique().tolist()[:10]) # Limit to 10
    except Exception as e:
        print('Equities Error:', e)

    print(f"\n--- Inspecting FnO for {date_str} ---")
    try:
        fno = derivatives.fno_bhav_copy(date_str)
        cols = ['FinInstrmTp', 'FinInstrmNm', 'SctySrs', 'Sgmt']
        for col in cols:
            if col in fno.columns:
                print(f"FnO {col} Unique:", fno[col].unique().tolist()[:10])
    except Exception as e:
        print('FnO Error:', e)

if __name__ == "__main__":
    inspect_data()
