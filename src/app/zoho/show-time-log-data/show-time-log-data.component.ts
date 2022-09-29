import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-time-log-data',
  templateUrl: './show-time-log-data.component.html',
  styleUrls: ['./show-time-log-data.component.css']
})
export class ShowTimeLogDataComponent implements OnInit {
  objTemp: any;

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.onGetTampData();
  }

  onGetTampData() {
    this.http.get('https://zoho-time-traker-default-rtdb.firebaseio.com/submittedTimeLog.json').subscribe((res) => {
      this.objTemp = res;
    })
  }
}
