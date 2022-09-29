import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sound02',
  templateUrl: './sound02.component.html',
  styleUrls: ['./sound02.component.css']
})
export class Sound02Component implements OnInit {

  isTimerPlaying = true;
  audio:any = document.getElementById('audio');
  playpause:any = document.getElementById("play");

  constructor() { }

  ngOnInit(): void {
  }

  togglePlayPause() {
    this.isTimerPlaying = !this.isTimerPlaying;
    if (this.audio.paused || this.audio.ended) {
      this.playpause.title = "Pause";
      this.audio.play();
    } else {
      this.playpause.title = "Play";
      this.audio.pause();
    }
  }
}
