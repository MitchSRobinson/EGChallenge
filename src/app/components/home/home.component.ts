import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/api-util.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public instruments;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getInstruments().subscribe(instruments => {
      this.instruments = instruments;
    });
  }
}
