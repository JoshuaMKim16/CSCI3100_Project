# import requests
# import time
# import json

# def get_place_price_range(api_key, place_id):
#     url = f'https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=price_range&key={api_key}'
#     retries = 3
#     attempt = 0
#     while attempt < retries:
#         try:
#             response = requests.get(url)
#             data = response.json()
#             if data['status'] == 'OK':
#                 price_range = data.get('result', {}).get('price_range', {})
#                 start_price = price_range.get('startPrice')
#                 end_price = price_range.get('endPrice')
#                 return {'startPrice': start_price, 'endPrice': end_price}
#             else:
#                 print(f"获取价格范围出错，状态码: {data['status']}，第 {attempt + 1} 次重试...")
#                 attempt += 1
#                 time.sleep(2)
#         except Exception as e:
#             print(f"发生异常: {e}，第 {attempt + 1} 次重试...")
#             attempt += 1
#             time.sleep(2)
#     return {'startPrice': None, 'endPrice': None}

# if __name__ == "__main__":
 #     with open('.env', 'r') as f:
#         API_KEY = f.readline().strip().split('=')[1].replace("'", "")
    
 #     with open('hk_attractions_text_search.json', 'r', encoding='utf-8') as f:
#         attractions = json.load(f)
    
 #     for attraction in attractions:
#         place_id = attraction.get('place_id')
#         if place_id:
#             price_info = get_place_price_range(API_KEY, place_id)
#             attraction['price'] = price_info
#         else:
#             attraction['price'] = {'startPrice': None, 'endPrice': None}
    
 #     with open('hk_attractions_updated.json', 'w', encoding='utf-8') as f:
#         json.dump(attractions, f, ensure_ascii=False, indent=4)
#     print("价格范围信息更新完成，已保存到 hk_attractions_updated.json")