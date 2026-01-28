import requests
import json

# 1. Check ALL stocks first
print("--- CHECKING /api/stocks/all ---")
try:
    resp_all = requests.get("http://localhost:5000/api/stocks/all")
    data_all = resp_all.json()
    count_all = data_all.get('count', 0)
    print(f"Total Raw Stocks: {count_all}")
    if count_all > 0:
        print(f"Sample Stock 0: {data_all['data'][0].get('symbol')} Cap: {data_all['data'][0].get('market_cap')}")
except Exception as e:
    print(f"Failed to fetch all stocks: {e}")

# 2. Check Screening
print("\n--- CHECKING /api/stocks/screen (1000-2500) ---")
url = "http://localhost:5000/api/stocks/screen"
payload = {"min_market_cap": 1000, "max_market_cap": 2500}
headers = {'Content-Type': 'application/json'}

try:
    response = requests.post(url, json=payload, headers=headers)
    data = response.json()
    
    stocks = data.get('data', [])
    print(f"Total stocks returned: {len(stocks)}")
    
    violations = []
    for stock in stocks:
        cap = stock.get('market_cap')
        symbol = stock.get('symbol')
        if cap is None:
            continue
        
        if cap > 2500:
            violations.append(f"{symbol}: {cap}")
            
    if violations:
        print(f"FAIL: Found {len(violations)} violations where Market Cap > 2500")
        print("Sample violations:", violations[:10])
    
    # Inspect specific duplicate/problematic stocks
    print("\n--- DEBUG: INSPECTING NCC & M&MFIN ---")
    for stock in stocks:
        if stock['symbol'] in ['NCC', 'M&MFIN', 'M_MFIN']:
            print(f"Found {stock['symbol']}: Cap={stock.get('market_cap')}, Price={stock.get('last_price')}, Name={stock.get('name')}")

except Exception as e:
    print(f"Error: {e}")
