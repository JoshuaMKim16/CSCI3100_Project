import requests
import time
import os
import json

# 定义香港的不同区域经纬度，增加更多区域
sub_locations = [
    "22.2797,114.1624",  # 港岛中心
    "22.3087,114.1754",  # 九龙
    "22.4408,114.0950",  # 新界
    "22.2934,114.1694",  # 尖沙咀
    "22.2481,114.1588"   # 中环
]

# 定义不同的景点类型，增加餐厅和更多景点类型
attraction_types = [
    "museums",
    "parks",
    "beaches",
    "temples",
    "zoos",
    "aquariums",
    "restaurants"
]

def get_attractions_by_text_search(api_key, query, max_results):
    url = f'https://maps.googleapis.com/maps/api/place/textsearch/json?query={query}&key={api_key}'
    attractions = []
    retries = 3  # 重试次数
    while len(attractions) < max_results:
        attempt = 0
        while attempt < retries:
            try:
                response = requests.get(url)
                data = response.json()
                if data['status'] == 'OK':
                    for result in data['results']:
                        place_id = result.get('place_id')
                        if place_id:
                            details = get_place_details(api_key, place_id)
                            photo_filenames = download_place_photos(api_key, result.get('photos', []))
                            # 生成 site_id（同原逻辑）
                            name = result.get('name', '')
                            hash_value = sum(ord(c) for c in name) % 10000000000000000
                            site_id = '{:016x}'.format(hash_value)
                            # 处理价格
                            price_level = details.get('price_level')
                            price = {1: "low", 2: "moderate", 3: "high", 4: "very high"}.get(price_level, "0") if price_level is not None else "0"
                            # 构造景点数据
                            attraction = {
                                'site_id': site_id,
                                'name': name or None,
                                'location': result.get('geometry', {}).get('location', None),
                                'address': result.get('formatted_address', None),  # 文本搜索返回更完整的地址
                                'opening_hour': details.get('opening_hours', {}).get('weekday_text', None),
                                'price': price,
                                'description': details.get('editorial_summary', {}).get('overview', None),
                                'type': details.get('types', None),
                                'picture': photo_filenames or None
                            }
                            attractions.append(attraction)
                    next_page_token = data.get('next_page_token')
                    if next_page_token:
                        time.sleep(2)  # 必须等待 2 秒以上，否则令牌无效
                        url = f'https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken={next_page_token}&key={api_key}'
                    else:
                        return attractions  # 无更多分页令牌
                    break
                else:
                    print(f"请求出错，状态码: {data['status']}，第 {attempt + 1} 次重试...")
                    attempt += 1
                    time.sleep(2)  # 等待2秒后重试
            except Exception as e:
                print(f"发生异常: {e}，第 {attempt + 1} 次重试...")
                attempt += 1
                time.sleep(2)  # 等待2秒后重试
        if attempt == retries:
            print("达到最大重试次数，停止请求。")
            break
    return attractions

def get_place_details(api_key, place_id):
    # 同原代码，增加更多字段（如需）
    url = f'https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=editorial_summary,price_level,opening_hours,types&key={api_key}'
    retries = 3
    attempt = 0
    while attempt < retries:
        try:
            response = requests.get(url)
            data = response.json()
            if data['status'] == 'OK':
                return data.get('result', {})
            else:
                print(f"获取景点详情出错，状态码: {data['status']}，第 {attempt + 1} 次重试...")
                attempt += 1
                time.sleep(2)
        except Exception as e:
            print(f"发生异常: {e}，第 {attempt + 1} 次重试...")
            attempt += 1
            time.sleep(2)
    return {}

def download_place_photos(api_key, photos):
    # 同原代码
    photo_filenames = []
    if not os.path.exists('attraction_photos'):
        os.makedirs('attraction_photos')
    for index, photo in enumerate(photos[:5]):
        photo_reference = photo.get('photo_reference')
        if photo_reference:
            photo_url = f'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={api_key}'
            try:
                photo_response = requests.get(photo_url)
                if photo_response.status_code == 200:
                    file_name = f'attraction_photos/{index}_{photo_reference[:10]}.jpg'
                    with open(file_name, 'wb') as f:
                        f.write(photo_response.content)
                    photo_filenames.append(file_name)
            except Exception as e:
                print(f"下载照片出错: {e}")
    return photo_filenames

if __name__ == "__main__":
    # 读取 API 密钥
    with open('google_api_key.env', 'r') as f:
        API_KEY = f.readline().strip().split('=')[1].replace("'", "")
    all_attractions = []
    MAX_RESULTS = 200  # 可设置更高，但受限于 API 配额
    for location in sub_locations:
        for attraction_type in attraction_types:
            query = f'{location} {attraction_type}'
            attractions = get_attractions_by_text_search(API_KEY, query, MAX_RESULTS)
            all_attractions.extend(attractions)

    # 去除重复的景点
    unique_attractions = []
    unique_site_ids = set()
    for attraction in all_attractions:
        site_id = attraction['site_id']
        if site_id not in unique_site_ids:
            unique_site_ids.add(site_id)
            unique_attractions.append(attraction)

    print(f"成功获取 {len(unique_attractions)} 个景点和餐厅信息")
    # 保存结果
    with open('hk_attractions_text_search.json', 'w', encoding='utf-8') as f:
        json.dump(unique_attractions, f, ensure_ascii=False, indent=4)
    