import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, config } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DataService {

  constructor(private httpClient: HttpClient) {
  }

  public getInstrument<T>(): Observable<T> {
    return this.httpClient.get<T>("http://egchallenge.tech/marketdata/instrument/2")
  }
}