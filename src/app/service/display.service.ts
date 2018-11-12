import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {

  xs = false;
  noXs = false;
  sm = false;
  md = false;
  lg = false;
  xl = false;
  xxl = false;
  width = 0;
  height = 0;

  constructor() {
    let observable = fromEvent(window, 'resize');
    observable.pipe(debounceTime(100)).subscribe(e => {
      this.onResize();
    });
    this.onResize();
  }

  get size(): String {
    if (this.xxl) {
      return 'xxl';
    }
    if (this.xl) {
      return 'xl';
    }
    if (this.lg) {
      return 'lg';
    }
    if (this.md) {
      return 'md';
    }
    if (this.sm) {
      return 'sm';
    }
    if (this.xs) {
      return 'xs';
    }
    return 'unknown: ' + this.width;
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    if (window.innerWidth < 576) {
      // this.xs.next(true);
      this.xs = true;
      console.log('xs');
    } else {
      console.log('xs');
      this.xs = true;
      this.noXs = true;
    }
    if (window.innerWidth >= 576) {
      this.sm = true;
      console.log('sm');
    } else {
      console.log('no sm');
      this.sm = false;
    }

    if (window.innerWidth >= 768) {
      this.md = true;
      console.log('md');
    } else {
      console.log('no md');
      this.md = false;
    }
    if (window.innerWidth >= 992) {
      this.lg = true;
      console.log('lg');
    } else {
      console.log('no lg');
      this.lg = false;
    }
    if (window.innerWidth >= 1200) {
      this.xl = true;
    } else {
      this.xl = false;
    }
    if (window.innerWidth >= 1600) {
      this.xxl = true;
    } else {
      this.xxl = false;
    }
  }
}
