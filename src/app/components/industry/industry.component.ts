import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/api-util.service';

@Component({
  selector: 'app-industry',
  templateUrl: './industry.component.html',
  styleUrls: ['./industry.component.css']
})
export class IndustryComponent implements OnInit {

  private interval;
  private latest;
  private instruments;
  private industries = {};
  public industries_array;


  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getInstruments().subscribe(instruments => {
      this.instruments = instruments as any[];
    });
    this.refreshData();
    this.interval = setInterval(() => { 
        this.refreshData(); 
    }, 1000);
  }

  refreshData() {
    this.dataService.getLatest().subscribe(latest => {
      this.latest = latest as any[];

      for (let industry in this.industries) {
        this.industries[industry]['prices'] = []
        this.industries[industry]['changes'] = []
      }

      if (typeof this.instruments != 'undefined') {
        this.instruments.forEach(instrument => {
          instrument['latest'] = this.latest[instrument['id'] - 1]
          if (!(instrument.latest.price == 'null' || instrument.latest.epoch_return == 'undefined')) {
            if (typeof this.industries[instrument.industry] == 'undefined') {
              this.industries[instrument['industry']] = {
                'name': instrument['industry'], 
                'prices': [instrument.latest['price']],
                'average_price': instrument.latest['price'], 
                'changes': [instrument.latest['epoch_return']],
                'average_change': instrument.latest['epoch_return']
              }
            } else {
              this.industries[instrument.industry]['prices'].push(instrument.latest['price'])
              this.industries[instrument.industry]['changes'].push(instrument.latest['epoch_return'])
            }
          }
        });
      }
      this.industries_array = [];
      for (let industry in this.industries) {
        this.industries[industry]['average_price'] = this.average(this.industries[industry]['prices']);
        this.industries[industry]['average_change'] = this.average(this.industries[industry]['changes']);
        this.industries_array.push(this.industries[industry]);
      }
    });
  }

  average(array) {
    let sum = 0;
    array.forEach(element => {
      if (typeof element != 'undefined') {
        sum += element;
      }
    });
    return sum / array.length;
  }

}
