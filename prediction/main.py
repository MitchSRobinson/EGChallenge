import pandas as pd
import requests
import json
import datetime
import time
import predictmodel

def print_with_timestamp(message):
  print(str(datetime.datetime.now()) + ": " + message)

def login(team_name="Spice Girls", password="spice_girls"):
    data = {}
    url = "http://egchallenge.tech/team/login"
    payload = "{\n\t\"team_name\": \"Spice Girls\",\n\t\"password\": \"spice_girls\"\n}\n"
    headers = {
        'Content-Type': "application/json",
        'Cache-Control': "no-cache",
        'Postman-Token': "c0cbea42-3c0c-4099-191e-9986c7748208"
    }
    data = json.dumps(data)
    resp = requests.post(url, data=payload, headers=headers).json()
    return resp['token']

def get_current_epoch():
  url = "http://egchallenge.tech/epoch"
  resp = requests.get(url)
  print(resp)
  if resp.status_code == 200:
    resp = resp.json()
    current_epoch = resp['current_epoch']
  return current_epoch

def currently_traded():
    current_epoch = get_current_epoch()

    url = "http://egchallenge.tech/marketdata/epoch/"

    column_headers = []
    resp = requests.get(url+str(current_epoch))
    if resp.status_code == 200:
      resp = resp.json()
      for instrument in resp:
        if instrument['is_trading']:
          column_headers.append(instrument['instrument_id'])

    return column_headers

def check_for_dead_stock(data):
  correct_columns = currently_traded()
  for column in list(data.columns.values):
    if column not in correct_columns:
      data = data.drop([column], axis=1)
  return data

#use i = -1 to generate from sheet
def iterative_update(data, i = 1):
  data = check_for_dead_stock(data)
  url = "http://egchallenge.tech/marketdata/epoch/"

  up_to_date = False

  if i==-1:
    i = data.index[-1] + 1

  while not up_to_date:
    i+=1
    values = []
    resp = requests.get(url + str(i))
    if resp.status_code == 200:
      print_with_timestamp("Building epoch: " + str(i))
      resp = resp.json()
      for instrument in resp:
        if instrument['instrument_id'] in list(data.columns.values):
          values.append(instrument['epoch_return'])
      data.loc[i] = values
    else:
      up_to_date = True

  return data, i-1

def new_get_dataset():
    df = pd.DataFrame()

    columns = currently_traded()
    i=0
    for column in columns:
      df.insert(loc=i, column=column, value=[])
      i += 1

    df, epoch = iterative_update(df, 1)

    return df, epoch

def is_current_epoch(i):
  return i == get_current_epoch()

if __name__ == "__main__":
    print_with_timestamp("Generating initial model")
    df = pd.read_csv("data.csv")
    print(list(df.columns.values))
    print(df)
    df = iterative_update(df, -1)
    epoch = get_current_epoch()
    while True:
      print_with_timestamp("Looping")
      if is_current_epoch(epoch):
        time.sleep(5)
      else:
        print_with_timestamp("New epoch detected, current " + str(epoch) + " detected " + str(get_current_epoch()))
        df, epoch = iterative_update(df, epoch)
        df.to_csv("data"+str(datetime.datetime.now()))
        # result = predictmodel.predict(convert_data_for_predict(df))
        print()
