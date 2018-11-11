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

  _epochWindow = 60;

  get selectedEpoch(): number {
    return this._epochWindow;
  }

  set selectedEpoch(epoch: number) {
    this._epochWindow = epoch;
    console.log(epoch);
    let window = this.epochWindow(this.price, this.epoch, epoch);
    this.chart.data.datasets[0].data = window[0];
    this.chart.config.data.labels = window[1];
    console.log(window[0]);
    this.chart.update();
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
        catchError(error => console.log(error))
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
        if (!this.chart) {
          this.createChart(this.chartData, this.chartEpoch);
        }
        this.selectedEpoch = this.selectedEpoch;
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
        // When the graph is clicked return the active points pressed - if any
        // Reset all points on the graph to be white
        // Get the index of the clicked point and change its border color to red
        // onClick: function(evt, activeElements) {
        //   if (activeElements.length != 0) {
        //     var elementIndex = activeElements["0"]._index;
        //     for (let index = 0; index < 4; index++) {
        //       this.data.datasets[0].pointBorderColor[index] = '#B8B8B8';   
        //     }
        //     this.data.datasets[0].pointBorderColor[elementIndex] = 'red';
        //     this.update();
        //   }
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


}
