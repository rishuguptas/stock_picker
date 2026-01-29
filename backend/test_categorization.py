import pandas as pd
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from services.stock_service import stock_service

def test_categorization():
    # Mock row based on debug output
    row = pd.Series({
        'FinInstrmTp': 'STK',
        'SctySrs': 'NC',
        'FinInstrmNm': 'SEC RE NCD 10.03% SR V'
    })
    
    category = stock_service._categorize_instrument(row)
    print(f"Symbol: 1003IIFL29")
    print(f"FinInstrmTp: {row['FinInstrmTp']}")
    print(f"SctySrs: {row['SctySrs']}")
    print(f"Categorized as: {category}")

if __name__ == "__main__":
    test_categorization()
