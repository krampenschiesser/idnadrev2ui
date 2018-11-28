import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { GenericService } from '../../service/generic.service';
import Promodoro from '../../dto/generic/Promodoro';

@Component({
  selector: 'app-promodoro',
  templateUrl: './promodoro.component.html',
  styleUrls: ['./promodoro.component.css']
})
export class PromodoroComponent implements OnInit, OnDestroy {
  form = new FormGroup({
    intervals: new FormControl(undefined, [numberValidator()]),
    workTime: new FormControl(undefined, [numberValidator()]),
    breakTime: new FormControl(undefined, [numberValidator()]),
  });

  visible = false;
  promodoro: Promodoro;

  private timer?: number;

  work?: boolean;
  done?: number;
  max?: number;

  constructor(private genericService: GenericService) {
  }

  async ngOnInit() {
    let promodoro = await this.genericService.getPromodoro();
    if (promodoro) {
      this.promodoro = promodoro;
      this.form.patchValue(promodoro);
      if (promodoro.isStarted()) {
        this.countdown();
        if (promodoro.isStarted()) {
          this.startTimer();
        }
      }
    }
  }

  onStart() {
    Object.assign(this.promodoro, this.form.value);
    this.genericService.startPromodoro(this.promodoro);
    this.countdown();
    this.startTimer();
    this.visible = false;
  }

  onStop() {
    clearTimeout(this.timer);
    this.genericService.stopPromodoro(this.promodoro);
    this.done = undefined;
    this.max = undefined;
    this.work = undefined;
  }

  startTimer() {
    this.timer = setInterval(() => this.countdown(), 10000);
  }

  countdown() {
    let startTime = this.promodoro.startTime;
    if (startTime) {
      let now = new Date().getTime();
      let started = startTime.getTime();
      let elapsedInMin = Math.floor((now - started) / 1000 / 60);
      //25 5; 25 5; 25 5; 25 5;
      //37 % 30 = 7 -> 18 remaining work
      //58 % 30 = 28 -> 2 remaining break
      let intervalLength = this.promodoro.workTime + this.promodoro.breakTime;
      console.log(this.promodoro)
      console.log(elapsedInMin)
      console.log(intervalLength * this.promodoro.intervals)
      let positionInInterval = elapsedInMin % (intervalLength);
      if (elapsedInMin > intervalLength * this.promodoro.intervals) {
        this.onStop();
      } else if (positionInInterval <= this.promodoro.workTime) {
        this.work = true;
        this.done = positionInInterval;
        this.max = this.promodoro.workTime;
      } else {
        this.work = false;
        this.done = intervalLength - this.promodoro.workTime;
        this.max = this.promodoro.breakTime;
      }
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}

function numberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let value = control.value;
    let forbidden = true;
    if (typeof value === 'number' && value > 0) {
      forbidden = false;
    }
    return forbidden ? {'invalidNumber': {value: control.value}} : null;
  };
}

