import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {
  // xs = new BehaviorSubject<boolean>(false);
  // sm = new BehaviorSubject<boolean>(false);
  // md = new BehaviorSubject<boolean>(false);
  // lg = new BehaviorSubject<boolean>(false);
  // xl = new BehaviorSubject<boolean>(false);
  // xxl = new BehaviorSubject<boolean>(false);
  // landscape = new BehaviorSubject<boolean>(false);
  // portrait = new BehaviorSubject<boolean>(false);

  xs = false;
  sm = false;
  md = false;
  lg = false;
  xl = false;
  xxl = false;
  landscape = false;
  portrait = false;
  width = 0;
  height = 0;

  constructor() {
    let observable = fromEvent(window, 'resize');
    observable.pipe(debounceTime(100)).subscribe(e => {
      this.onResize();
    });
    this.onResize();
  }

  onResize() {
    this.width = window.innerWidth;
    console.log(this.width);
    this.height = window.innerHeight;
    let landscape = window.innerWidth >= window.innerHeight;
    this.landscape = landscape;
    this.portrait = !landscape;
    if (landscape) {
      if (window.innerWidth < 576) {
        // this.xs.next(true);
        this.xs = true;
      } else {
        this.xs = true;
      }
    }
    if (window.innerWidth >= 576) {
      // this.sm.next(true);
      this.sm = true;
      console.log('sm');
    } else {
      console.log('no sm');
      this.sm = false;
    }

    if (window.innerWidth >= 768) {
      // this.md.next(true);
      this.md = true;
      console.log('md');
    } else {
      console.log('no md');
      this.md = false;
    }
    if (window.innerWidth >= 992) {
      // this.lg.next(true);
      this.lg = true;
      console.log('lg');
    } else {
      console.log('no lg');
      this.lg = false;
    }
    if (window.innerWidth >= 1200) {
      // this.xl.next(true);
      this.xl = true;
    } else {
      this.xl = false;
    }
    if (window.innerWidth >= 1600) {
      // this.xxl.next(true);
      this.xxl = true;
    } else {
      this.xxl = false;
    }
  }
}
