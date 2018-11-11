import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndicatorsService {

  constructor() { }

  getSimpleMovingAverage(data): number[] {
    var N = data.length;
    var someData = [];
    for (var i = 0; i < N; i++) {
      someData.push([i, Math.random() * 100]);
    }

    var moveMean = [];
    for (var i = 1; i < N - 1; i++) {
      var mean = (someData[i][1] + someData[i - 1][1] + someData[i + 1][1]) / 3.0;
      moveMean.push([i, mean]);
    }
    return moveMean;
  }

  getExponentialMovingAverage(mArray, mRange) {
    var k;
    // first item is just the same as the first item in the input
    let emaArray = [mArray[0]];
    // for the rest of the items, they are computed with the previous one
    for (var i = 1; i < mArray.length; i++) {
      if (i < mRange) {
        k = 2 / (i + 1);
      } else {
        k = 2 / (mRange + 1)
      }
      emaArray.push(mArray[i] * k + emaArray[i - 1] * (1 - k));
    }
    console.log(emaArray);
    return emaArray;
  }

  getMovingStandardDeviation() {

  }
}
