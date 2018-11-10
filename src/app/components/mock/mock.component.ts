import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/api-util.service';

@Component({
  selector: 'app-mock',
  templateUrl: './mock.component.html',
  styleUrls: ['./mock.component.css']
})
export class MockComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getInstruments().subscribe(data => {
      console.log(data);
    });
    this.dataService.getInstrument(3).subscribe(data => {
      console.log(data);
    })
  }
}
