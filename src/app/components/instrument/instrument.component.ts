import { Component, OnInit, Input } from '@angular/core';

import { Chart, ChartData, Point } from 'chart.js';
import { DataService } from 'src/app/services/api-util.service';
import { ActivatedRoute } from '@angular/router';
import { timer, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, catchError } from 'rxjs/operators';
import { IndicatorsService } from 'src/app/services/indicators.service';

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.component.html',
  styleUrls: ['./instrument.component.css']
})
export class InstrumentComponent implements OnInit {

  chart: Chart;

  id: number;

  chartData: [];
  chartEpoch: [];

  emaArray: any[];
  emaRange = 50;

  price: any[];
  epoch: any[];

  someRange = [1,5];
  rangeMin = 0;
  rangeMax = 60;
  custom_range = false;

  _epochWindow = 60;

  get selectedEpoch(): number {
    return this._epochWindow;
  }

  set selectedEpoch(epoch: number) {
    this._epochWindow = epoch;

    if (typeof epoch !==  'undefined') {
      this.custom_range = false;
      this.someRange = [this.price.length - epoch, this.price.length];
      this.updateGraph(this.someRange[0], this.someRange[1]);
    } else {
      this.custom_range = true;
    }
  }

  
  constructor(
      private dataService: DataService,
      private indicatorService: IndicatorsService,
      private route: ActivatedRoute
    ) { }

  ngOnInit() {

    this.price = [];
    this.epoch = [];
    this.chartData = [];
    this.chartEpoch = [];

    this.route.params.subscribe(param => {
      this.id = param['id'];
      this.selectedEpoch = undefined;

      timer(0, 30*1000)
      .pipe(
        // This kills the request if the user closes the component 
        // takeUntil(this.killTrigger),
        // switchMap cancels the last request, if no response have been received since last tick
        switchMap(() => this.dataService.getInstrument(this.id)),
        // catchError handles http throws 
        // catchError(error => console.log(error))
      ).subscribe(result => {
        // get all price points
        console.log('Making Call');
        let data = result as any[];
        this.price = [];
        this.epoch = [];
        for (let i = 0; i < data.length; i++) {
          this.price.push(data[i].prev_epoch_price); 
          this.epoch.push(data[i].epoch);
        }
        this.rangeMax = this.price.length;
        // Calc exponential moving average
        this.emaArray = this.indicatorService.getExponentialMovingAverage(this.price, this.emaRange);
        
        if (!this.chart) {
          this.createChart(this.chartData, this.chartEpoch, this.emaArray);
          this.updateGraph(0, this.price.length);  
          this.someRange = [0, this.price.length];
        } else {
          if (typeof this.selectedEpoch === 'undefined') {
            this.updateGraph(this.someRange[0], this.someRange[1]);
          } else {
            this.updateGraph(this.price.length - this.selectedEpoch, this.price.length);
          }
        }
      });  
    });
  }
  
  createChart(price: number[], epoch: number[], ema: any[]) {
    this.chart = new Chart(`chart-canvas`, {
      type: 'line',
      data: {
        labels: epoch,
        datasets: [
          {
            pointHoverRadius: 10,
            pointHitRadius: 10,
            label: 'Price',
            data: price,
            borderColor: 'blue'
          },
          {
            pointHoverRadius: 10,
            pointHitRadius: 10,
            label: 'EMA',
            data: ema,
            borderColor: 'red'
          }
        ]
      },
      options: {
        elements: {
          point:{
              radius: 0
          }
      }
        },
        tooltips: {
					mode: 'index',
					intersect: false,
				},
        title: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: ''
            }
          }],
        }
    });

    console.log(this.chart);
  }

  epochWindow(price, epoch, window) {
    let newPrice = price.slice(price.length - window);
    let newEpoch = epoch.slice(epoch.length - window);
    return [newPrice, newEpoch];
  }

  epochRange(start, end) {
    let price = this.price.slice(start, end);
    let epoch = this.epoch.slice(start, end);
    let ema = this.emaArray.slice(start, end);
    return [price, epoch, ema];
  }

  setEmaRange() {
    console.log(this.emaRange);
    this.emaArray = this.indicatorService.getExponentialMovingAverage(this.price, this.emaRange);
    this.updateGraph(this.someRange[0], this.someRange[1]);
  }
  

  onChange(event: Event) {
    console.log(event);
    // Refresh selected epoch when range changed
    this.updateGraph(event[0], event[1]);
    if (this.custom_range) {
      console.log('Set undefined');
      this.selectedEpoch = undefined;
    } else {
      this.custom_range = false;
    }
  }

  updateGraph(start, end) {
    let window = this.epochRange(start, end);
    this.chart.data.datasets[0].data = window[0];
    this.chart.data.datasets[1].data = window[2];
    this.chart.config.data.labels = window[1];
    this.chart.update();
  }

}
