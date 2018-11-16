import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { BehaviorSubject } from 'rxjs';
import Promodoro from '../dto/generic/Promodoro';

@Injectable({
  providedIn: 'root'
})
export class PromodoroService {
  currentInterval = 0;
  remainingTime = 0;

  promodoro?: Promodoro;
  stopped = true;
  handle?: number;

  constructor(private genericService: GenericService) {
  }

  async start() {
    this.stopped = false;
    this.promodoro = await this.genericService.getPromodoro();
    this.remainingTime = this.promodoro.workTime * 6;
    this.handle = setTimeout(this.onTimeout, 10000);
  }

  stop() {
    if (this.handle) {
      clearTimeout(this.handle);
    }
  }

  onTimeout() {
    if (this.stopped) {
      return;
    }
    this.remainingTime -= 1;
    if (this.remainingTime == 0) {
      this.currentInterval++;
      this.remainingTime = this.promodoro.breakTime * 6;
    }
    if (this.currentInterval > this.promodoro.intervals) {
      this.currentInterval = 0;
    } else {
      setTimeout(this.onTimeout, 10000);
    }
  }

  isBreak() {
    return this.currentInterval % 2 == 0;
  }

  isWork() {
    return this.currentInterval % 2 == 1;
  }
}
