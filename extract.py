import pandas as pd
import json

try:
    df = pd.read_excel(r'G:\VIBE CODE THẦY DUYỆT\App cho Anh Táo demo\Web Anh Táo FN\Báo giá máy + sửa.xlsx', sheet_name=None)
    data = {k: v.fillna('').to_dict(orient='records') for k, v in df.items()}
    with open('prices.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Success")
except Exception as e:
    print(f"Error: {e}")
