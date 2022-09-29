import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimeTrakerService {

  constructor(private http:HttpClient) { }

  public getAddress(lat:any,lng:any) {
    return this.http.get(
      'https://api.opencagedata.com/geocode/v1/json?q='+lat+'+'+lng+'&key=6993325a975f4a768518d18b911a5277'
    )
  }
}
