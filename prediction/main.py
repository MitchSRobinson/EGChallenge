import pandas as pd
import requests
import json
import datetime
import time
import predictmodel
from numpy import array
import numpy as np

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

    df, epoch = iterative_update(df, 4060)

    return df, epoch

def df_to_list_series(df):
  cols = df.columns
  data = {}
  for col in df.columns:
    data[col] = df[col].tolist()

  return data

def submit(epoch, data):
  url = "http://egchallenge.tech/predict"
  
  payload = "{\n\t\"team_name\": \"Spice Girls\",\n\t\"password\": \"spice_girls\"\n}\n"
  headers = {
      'Content-Type': "application/json",
      'Cache-Control': "no-cache",
      'Postman-Token': "c0cbea42-3c0c-4099-191e-9986c7748208"
  }

  data = {
    'token': login(),
    'epoch': epoch + 1,
    'predictions': data
  }

  requests.post(url, json=json.dumps(data), headers=headers)


def is_current_epoch(i):
  return i == get_current_epoch()

def normalize_windows(window_data):
	"""Normalize data"""

	normalized_data = []
	for window in window_data:
		normalized_window = [((float(p) / float(window[0])) - 1) for p in window]
		normalized_data.append(normalized_window)
	return normalized_data

if __name__ == "__main__":
    print_with_timestamp("Generating initial model")
    # df = pd.read_csv("data.csv")
    df, epoch = new_get_dataset()
    # print(list(df.columns.values))
    # print(df)
    # df = iterative_update(df, -1)
    # epoch = get_current_epoch()
    while True:
      print_with_timestamp("Looping")
      if is_current_epoch(epoch):
        time.sleep(1)
      else:
        print_with_timestamp("New epoch detected, current " + str(epoch) + " detected " + str(get_current_epoch()))
        df, epoch = iterative_update(df, epoch)
        df.to_csv("data"+str(datetime.datetime.now()).strip().replace(".","").replace(":","").replace("-","") + ".csv")
        data = []
        for column in df:
          dict = {}
          current = df[column]
          print(current.name)
          dict["instrument_id"] = current.name
          # Last window, for next time stamp prediction
          # last_raw = [current[-6:]]
          last = [current[-6:]]
          # last = normalize_windows(last_raw)
          last = np.array(last)
          last = np.reshape(last, (last.shape[0], last.shape[1], 1))
          dict["predicted_return"] = predictmodel.predict(last)
        print(data)
        # result = predictmodel.predict(convert_data_for_predict(df))
        print()
