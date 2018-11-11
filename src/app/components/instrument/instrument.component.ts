import { Component, OnInit, Input } from '@angular/core';

import { Chart, ChartData, Point } from 'chart.js';
import { DataService } from 'src/app/services/api-util.service';
import { ActivatedRoute } from '@angular/router';
import { timer, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, catchError } from 'rxjs/operators';

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

  price: any[];
  epoch: any[];

  someRange = [1,5];
  rangeMin = 0;
  rangeMax = 60;

  _epochWindow = 60;

  get selectedEpoch(): number {
    return this._epochWindow;
  }

  set selectedEpoch(epoch: number) {
    this._epochWindow = epoch;
    if (typeof epoch !==  undefined) {
      this.someRange = [this.price.length - epoch, this.price.length];
      this.updateGraph(this.someRange[0], this.someRange[1]);
    }
  }
  
  constructor(
      private dataService: DataService,
      private route: ActivatedRoute
    ) { }

  ngOnInit() {

    this.price = [];
    this.epoch = [];
    this.chartData = [];
    this.chartEpoch = [];

    this.route.params.subscribe(param => {
      this.id = param['id'];

      timer(0, 20*1000)
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
        if (!this.chart) {
          this.createChart(this.chartData, this.chartEpoch);
          this.updateGraph(0, this.price.length);  
          this.someRange = [0, this.price.length];
        } else {
          this.updateGraph(this.price.length - this.selectedEpoch, this.price.length);
        }
      });  
    });
  }
  
  createChart(price: number[], epoch: number[]) {
    this.chart = new Chart(`chart-canvas`, {
      type: 'line',
      data: {
        labels: epoch,
        datasets: [
          {
            pointHoverRadius: 10,
            pointHitRadius: 10,
            label: 'New',
            data: price
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
    console.log(price);
    return [price, epoch];
  }

  onChange(event: Event) {
    console.log(event);
    // Refresh selected epoch when range changed
    this.updateGraph(event[0], event[1]);
    // this.selectedEpoch = undefined;
  }

  updateGraph(start, end) {
    let window = this.epochRange(start, end);
    this.chart.data.datasets[0].data = window[0];
    this.chart.config.data.labels = window[1];
    this.chart.update();
  }

}
