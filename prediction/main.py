import pandas as pd
import requests
import json

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

def get_dataset():
    url = "http://egchallenge.tech/marketdata/instrument/"

    df = pd.DataFrame()

    for i in range(1, 501):
        resp = requests.get(url + str(i))
        if resp.status_code == 200:
            resp = resp.json()
            data = {"instrument": resp[0]['instrument_id']}
            for epoch in resp:
                if epoch['epoch_return'] == 'nan':
                    data[epoch['epoch']] = 0
                else:
                    data[epoch['epoch']] = epoch['epoch_return']
            df = df.append(data, ignore_index=True)

    df.set_index('instrument')
    return df


def update_dataset(df):
    url = "http://egchallenge.tech/marketdata/latest"

    resp = requests.get(url)
    if resp.status_code == 200:
        new_df = pd.DataFrame(index=df.index.values)
        resp = resp.json()
        for instrument in resp:
            if new_df == None:
                pd.DataFrame()
            new_df.loc[instrument['instrument_id']] = [ instrument['epoch_return'] ]
            data[epoch['epoch']] = epoch['epoch_return']

    return pd.concat([df, new_df], axis=1, sort=False)


if __name__ == "__main__":
    # df = get_dataset()

    # df.to_pickle("./prediction/dataset.pkl")

    df = pd.read_pickle("./prediction/dataset.pkl")
    
    df = update_dataset(df)
    
    df.to_pickle("./prediction/dataset.pkl")