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

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.refreshData();
    this.interval = setInterval(() => { 
        this.refreshData(); 
    }, 5000);
  }

  refreshData() {
    this.dataService.getLatest().subscribe(latest => {
      this.latest = latest;
    });
    this.dataService.getInstruments().subscribe(instruments => {
      this.instruments = instruments;
    });
  }

}
