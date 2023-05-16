import json

arr = []

with open('productPricesImages.json', 'r') as f:
  data = json.load(f)
  for row in data:
    my_dict = {'product_id': row['product_id'], 'product_image': row['product_image']}
    arr.append(my_dict)

with open('images.json', 'w') as json_file:
  json.dump(arr, json_file, indent=2)

arr = []

with open('csvToJsonPrices.json', 'r') as f:
  data = json.load(f)
  for row in data:
    my_dict = {'id': row['product_id'], 'prices': [{'date': row['date1'],'price': row['product_price1']}, {'date': row['date2'],'price': row['product_price2']}, {'date': row['date3'],'price': row['product_price3']}, {'date': row['date4'],'price': row['product_price4']}, {'date': row['date5'],'price': row['product_price5']}]}
    arr.append(my_dict)

my_dict = {"fetch_date": 1669190231, "data": arr}
with open('updatePrices.json', 'w') as json_file:
  json.dump(my_dict, json_file, indent=2)