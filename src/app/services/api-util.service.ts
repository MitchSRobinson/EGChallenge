import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, config } from 'rxjs';
import { HttpParamsOptions } from '@angular/common/http/src/params';

@Injectable()
export class DataService {

  private serverUrl = 'http://egchallenge.tech/';

  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  private currentEpochEndpoint = 'epoch';
  private instrumentsEndpoint = 'instruments';
  private instrumentEndpoint = 'marketdata/instrument/';
  private epochEndpoint = 'marketdata/epoch/';
  private latestEndpoint = 'marketdata/latest';

  constructor(private httpClient: HttpClient) {
  }

  public call<T>(endpoint: string, id: number = null): Observable<T> {

    // const httpParams: HttpParamsOptions = { } as HttpParamsOptions;
    // const options = { params: new HttpParams(httpParams), headers: this.headers };

    let url = (id) ? this.serverUrl + endpoint + id
      : this.serverUrl + endpoint;
    
    return this.httpClient.get<T>(url);
  }

  getCurrentEpoch() {
    return this.call(this.currentEpochEndpoint);
  };

  getInstruments() {
    return this.call(this.instrumentsEndpoint);
  }

  getInstrument(id: number) {
    return this.call(this.instrumentEndpoint, id);
  }

  getEpoch(epoch: number) {
    return this.call(this.epochEndpoint, epoch);
  }

  getLatest() {
    return this.call(this.latestEndpoint);
  }

}

interface instruments {

}
