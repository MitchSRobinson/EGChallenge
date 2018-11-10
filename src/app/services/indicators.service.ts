import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndicatorsService {

  constructor() { }

  getSimpleMovingAverage(data): number[] {
    var N = data.length;
    var someData = [];
    for (var i = 0; i < N; i++)
    {
        someData.push([i,Math.random() * 100]);
    }

    var moveMean = [];
    for (var i = 1; i < N-1; i++)
    {
        var mean = (someData[i][1] + someData[i-1][1] + someData[i+1][1])/3.0;
        moveMean.push([i,mean]);
    }
    return moveMean;
  }

  getExponentialMovingAverage() {

  }

  getMovingStandardDeviation() {

  }
}
