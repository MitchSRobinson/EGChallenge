import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/api-util.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public current_epoch = 0;
  public instruments;
  public latest;
  public interval;

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
