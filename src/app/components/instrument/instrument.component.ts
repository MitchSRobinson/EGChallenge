import { Component, OnInit, Input } from '@angular/core';

import { Chart, ChartData, Point } from 'chart.js';
import { DataService } from 'src/app/services/api-util.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.component.html',
  styleUrls: ['./instrument.component.css']
})
export class InstrumentComponent implements OnInit {

  @Input() id: number;

  chart: Chart;

  chartData: [];
  chartEpoch: [];
  
  constructor(private dataService: DataService, private route: ActivatedRoute) { 
    this.route.params.subscribe( params => this.id = params.id );
  }

  ngOnInit() {
    console.log(this.id)
    this.dataService.getInstrument(this.id).subscribe(result => {
      // get all price points
      let data = result as any[];
      let price = [];
      let epoch = [];
      for (let i = 0; i < data.length; i++) {
        price.push(data[i].prev_epoch_price); 
        epoch.push(data[i].epoch);
      }
      // 10 epoch window
      // 30 epoch window

      // 60 epoch window
      let window60 = this.epochWindow(price, epoch, 60);
      let window30 = this.epochWindow(price, epoch, 30);
      let window10 = this.epochWindow(price, epoch, 10);

      this.createChart(this.chartData, this.chartEpoch);
    })
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
