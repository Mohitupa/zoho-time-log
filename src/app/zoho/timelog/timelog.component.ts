import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { TimeTrakerService } from 'src/app/services/time-traker.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-timelog',
  templateUrl: './timelog.component.html',
  styleUrls: ['./timelog.component.css'],
  providers: [DatePipe]
})
export class TimelogComponent implements OnInit {

  @ViewChild('f') form: any;
  @ViewChild('formCheckIn') formCheck: any;

  projectDefault: any = "Select Project";
  jobDefault: any = "Select Job";
  workDefault: any = "Select Work Item";
  billableDefault = "Billable";

  projects: any = [
    { name: 'MangoIt Internal Project' },
    { name: 'Digital Health Project' },
    { name: 'Nimbus Data Project' },
    { name: 'Test Project' },
  ];
  jobs: any = [
    { name: 'Assignment 1' },
    { name: 'Assignment 2' },
    { name: 'Assignment 3' },
    { name: 'Assignment 4' },
  ];
  WorkItem: any = [
    { name: 'Coding' },
    { name: 'Project Management' },
    { name: 'Designing' },
    { name: 'HR' },
    { name: 'QA' },
  ];

  timeLogData: any = [];
  today = new Date();
  title: any;
  addName: any;
  show = true;
  startTimmer = true;
  tableData = [];
  hour = 0;
  minute = 0;
  second = 0;
  millisecond = 0;
  timerDisable = false;
  showTable = false;
  cron: any;
  currentTime: any;
  pausedTime: any = '00:00:00';
  currentLocation: any;

  indexCurrent: any;
  lng: any;
  lat: any;
  baseUrl = 'https://api.positionstack.com/v1/reverse';
  loc: any;
  btnNotSubmit = false;
  popup = false;
  popup1 = false;
  name = 'Angular';
  objTemp: any;

  constructor(private timeTrakService: TimeTrakerService, private http: HttpClient, private datePipe: DatePipe) { }

  // @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
  //   let result = alert("Please Stop the timer before leaving the Page.");

  //   console.log('dfadsfdf');
  //   event.returnValue = false; // stay on same page
  // }

  ngOnInit(): void {
    this.http.get('https://zoho-time-traker-default-rtdb.firebaseio.com/postTamp.json').subscribe((res) => {
     console.log(res);     
      let val: any = res;
      if (val != null) {
        let model: any = Object.values(val);
        console.log(model);        
        this.timeLogData = model[0].data;
        console.log(this.timeLogData);
        this.btnNotSubmit = true;
        this.showTable = true;
        let currentTime = this.datePipe.transform(new Date(), 'h:mm:ss');
        let oldTime = model[0].data[0].milliSec;  
        let date = new Date();
        let time = date.getTime()
        let cTime = (time - oldTime);
        let t = this.getYoutubeLikeToDisplay(cTime);
        console.log(t);     
        var array = t.split(':');
        array = array.reverse();  
        console.log(array,this.hour,this.minute,this.second);
        this.timeLogData[0]['pausedTime'] = ((array[2]?array[2]:'00')+":"+array[1]+":"+array[0])
        this.startMini(0);
      }
    })
  }

  getYoutubeLikeToDisplay(millisec:any) {
    var seconds:any = (millisec / 1000).toFixed(0);
    var minutes:any = Math.floor(seconds / 60);
    var hours:any = "";
    if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        hours = (hours >= 10) ? hours : "0" + hours;
        minutes = minutes - (hours * 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
    }

    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    if (hours != "") {
        return hours + ":" + minutes + ":" + seconds;
    }
    return minutes + ":" + seconds;
}

  onChange(ev: any) {
    if (ev.target.value == 'addProject') {
      this.show = false;
      this.addName = "Project";
      this.title = 'Project Configuaration Details';
    } else if (ev.target.value == 'addJob') {
      this.show = false;
      this.addName = "Job";
      this.title = 'Job Configuaration Details';
    } else {
      console.log(ev.target.value);
    }
  }
  cancel() {
    this.show = true;
  }

  onSubmit() {
    let key = Object.keys(this.form.value);
    console.log(key);
    if (key[0] == 'Project') {
      this.projects.push({ name: Object.values(this.form.value) });
    }
    if (key[0] == 'Job') {
      this.jobs.push({ name: Object.values(this.form.value) });
    }
    this.show = true;
    this.form.reset();
  }

  textareaValue = '';
  doTextareaValueChange(ev: any) {
    try {
      this.textareaValue = ev.target.value;
      console.log(ev.target.value);
    } catch (e) {
      console.info('could not set textarea-value');
    }
  }

  texttrue = true;
  textareaValue2: any = [];
  doTextareaValueChange2(ev: any) {
    console.log(ev);
    this.texttrue = false;
    try {
      this.textareaValue2.push(ev.target.value);
      this.texttrue = true;
      console.log(ev.target.value);
      console.log(this.textareaValue2);
    } catch (e) {
      console.info('could not set textarea-value');
    }
  }


  onCkeckIn() {
    console.log();

    if (this.formCheck.valid && this.textareaValue != '') {
      this.getlocation('checkIN');
    }
  }

  getlocation(funct: any) {
    if (!navigator.geolocation) {
      console.log('not supported geo location');
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
      this.timeTrakService.getAddress(this.lat, this.lng).subscribe((res: any) => {
        this.currentLocation = res.results[0].formatted;
        if (funct == 'checkIN') {
          if (this.timeLogData.length > 0) {
            this.valueInfo();
          }
          let date = new Date();
          let val: any = this.formCheck.value;
          val['startTime'] = this.datePipe.transform(date, 'h:mm:ss');
          val['milliSec'] = date.getTime();
          val['pausedTime'] = this.pausedTime;
          val['status'] = true;
          val['currentLocation'] = [val['startTime'] + '-:-' + this.currentLocation];
          val['discription'] = this.textareaValue;
          val['desc2'] = 'none';
          this.timeLogData.push(val)
          this.formCheck.reset();
          this.startTimmer = false;
          this.timerDisable = true;
          this.showTable = true;
          this.btnNotSubmit = true;
          this.start()
          this.localstore();
          this.onDeleteData();
          this.onSendTampData(this.timeLogData);
        }

        if (funct == 'checkOut') {
          this.pausedTime = this.currentTime;
          this.startTimmer = true;
          this.timerDisable = false;
          this.reset();
          this.pause();
        }
      });
    })
  }

  onCheckOut() {
    this.getlocation('checkOut');
  }
  onCheckOut12(i: any) {
    if (!navigator.geolocation) {
      console.log('not supported geo location');
    }
    navigator.geolocation.getCurrentPosition((pos: any) => {
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
      this.timeTrakService.getAddress(this.lat, this.lng).subscribe((res: any) => {

        this.currentLocation = res.results[0].formatted;
        this.pausedTime = this.currentTime;
        this.timeLogData[i]['status'] = !this.timeLogData[i]['status'];
        this.timeLogData[i]['pausedTime'] = this.pausedTime;
        this.timeLogData[i]['desc2'] = this.textareaValue2;
        this.getlocation('pausedOut');
        this.timeLogData[i]['currentLocation'].push(this.pausedTime + '-:-' + this.currentLocation);
        this.startTimmer = true;
        this.timerDisable = false;
        console.log(this.timeLogData);
        this.reset();
        this.pause();
        this.onDeleteData();
        this.onSendTampData(this.timeLogData);
      })
    })
  }

  start() {
    this.startTimmer = false;
    this.timerDisable = true;
    this.pause();
    this.cron = setInterval(() => { this.timer(); }, 10);
  }
  startMini(i: any) {
    if (!navigator.geolocation) {
      console.log('not supported geo location');
    }
    navigator.geolocation.getCurrentPosition((pos: any) => {
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
      this.timeTrakService.getAddress(this.lat, this.lng).subscribe((res: any) => {
        this.currentLocation = res.results[0].formatted;
        this.startTimmer = false;
        this.timerDisable = true;
        this.timeLogData[i]['status'] = true;
        this.timeLogData[i]['currentLocation'].push(this.pausedTime + '-:-' + this.currentLocation);
        var array = this.timeLogData[i]['pausedTime'].split(':');
        this.hour = parseInt(array[0]);
        this.minute = parseInt(array[1]);
        this.second = parseInt(array[2]);
        this.millisecond = 0;
        this.pause();
        this.cron = setInterval(() => { this.timer(); }, 10);
      })
    })
  }

  pause() {
    this.localstore();
    clearInterval(this.cron);
  }

  returnData(input: any) {
    return input >= 10 ? input : `0${input}`
  }

  reset() {
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    this.millisecond = 0;
    this.currentTime = '00:00:00'
  }

  timer() {
    if ((this.millisecond += 10) == 1000) {
      this.millisecond = 0;
      this.second++;
    }
    if (this.second == 60) {
      this.second = 0;
      this.minute++;
    }
    if (this.minute == 60) {
      this.minute = 0;
      this.hour++;
    }
    let h = this.returnData(this.hour);
    let m = this.returnData(this.minute);
    let s = this.returnData(this.second);
    this.currentTime = h + ' : ' + m + ' : ' + s
  }

  valueInfo() {
    for (let i = 0; i < this.timeLogData.length; i++) {
      this.timeLogData[i]['status'] = false;
      if (this.timeLogData[i]['pausedTime'] == '') {
        this.timeLogData[i]['pausedTime'] = this.pausedTime;
      }
    }
  }
  localstore() {
    if (this.timeLogData.length > 0) {
      localStorage.removeItem('TimeData');
      localStorage.setItem('TimeData', JSON.stringify(this.timeLogData));
      let val: any = localStorage.getItem('TimeData');
      let model = JSON.parse(val);
      console.log(model);
    }
  }

  removeLocalData() {
    console.log(this.timeLogData);
    localStorage.removeItem('TimeData');
    this.timeLogData = [];
    this.startTimmer = true;
    this.timerDisable = false;
    this.showTable = false;
    this.btnNotSubmit = false;
    this.onDeleteData();
    this.objTemp = '';
  }

  onSendTampData(data: any) {
    let myData: any = {
      id: 1,
      data: data
    }
    this.http.post('https://zoho-time-traker-default-rtdb.firebaseio.com/postTamp.json', myData).subscribe((res) => {
      console.log(res);
      this.onGetTampData();
    })
  }

  onGetTampData() {
    this.http.get('https://zoho-time-traker-default-rtdb.firebaseio.com/postTamp.json').subscribe((res) => {
      this.objTemp = res;
      console.log(this.objTemp);
    })
  }

  onDeleteData() {
    this.http.delete('https://zoho-time-traker-default-rtdb.firebaseio.com/postTamp.json').subscribe();
  }
}
