import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, config } from 'rxjs';

@Injectable()
export class DataService {

  constructor(private httpClient: HttpClient) {
  }

  public getInstruments() {
    return this.httpClient.get("http://egchallenge.tech/instruments");
  }

  public getInstrument(id: Number) {
    return this.httpClient.get("http://egchallenge.tech/marketdata/instrument/" + id);
  }
}
