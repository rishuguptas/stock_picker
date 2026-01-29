from nselib import capital_market
from datetime import datetime
import pandas as pd

def inspect_series():
    date_str = '28-01-2026'
    print(f"--- Inspecting Series for {date_str} ---")
    try:
        bhav = capital_market.bhav_copy_equities(date_str)
        if bhav.empty:
            print("Bhavcopy is empty")
            return
        
        stk_only = bhav[bhav['FinInstrmTp'] == 'STK']
        series_counts = stk_only['SctySrs'].value_counts()
        
        print(f"Total 'STK' instruments: {len(stk_only)}")
        print("\nTop 30 SctySrs values:")
        print(series_counts.head(30))
        
        # Look for examples of series that aren't in our current 'Stock' list
        equity_series = ['EQ', 'BE', 'BZ', 'SM', 'ST']
        debenture_prefixes = ('N', 'Y', 'GB')
        
        potential_miscategorized = []
        for srs, count in series_counts.items():
            if srs not in equity_series and not srs.startswith(debenture_prefixes):
                # Sample one symbol
                sample = stk_only[stk_only['SctySrs'] == srs].iloc[0]
                potential_miscategorized.append({
                    'Series': srs,
                    'Count': count,
                    'Sample_Symbol': sample['TckrSymb'],
                    'Sample_Name': sample['FinInstrmNm']
                })
        
        if potential_miscategorized:
            print("\nPotential Miscategorized (Labeled as Stock but may be Bond/Other):")
            df_pot = pd.DataFrame(potential_miscategorized)
            print(df_pot)
            
    except Exception as e:
        print('Error:', e)

if __name__ == "__main__":
    inspect_series()
