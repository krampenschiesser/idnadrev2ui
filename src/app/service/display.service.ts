import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {

  xs = false;
  xsObservable = new BehaviorSubject<boolean>(false);
  xsOnly = false;
  xsOnlyObservable = new BehaviorSubject<boolean>(false);
  sm = false;
  smObservable = new BehaviorSubject<boolean>(false);
  md = false;
  mdObservable = new BehaviorSubject<boolean>(false);
  lg = false;
  lgObservable = new BehaviorSubject<boolean>(false);
  xl = false;
  xlObservable = new BehaviorSubject<boolean>(false);
  xxl = false;
  xxlObservable = new BehaviorSubject<boolean>(false);
  width = 0;
  widthObservable = new BehaviorSubject<number>(0);
  height = 0;
  heightObservable = new BehaviorSubject<number>(0);

  constructor() {
    let observable = fromEvent(window, 'resize');
    observable.pipe(debounceTime(100)).subscribe(e => {
      this.onResize();
    });
    let orientationChange = fromEvent(window,'orientationchange');
    orientationChange.pipe(debounceTime(100)).subscribe(e => {
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
    this.widthObservable.next(this.width);
    this.heightObservable.next(this.height);
    if (window.innerWidth < 576) {
      // this.xs.next(true);
      this.xs = true;
      this.xsOnly = true;
      this.xsObservable.next(true);
      this.xsOnlyObservable.next(true);
    } else {
      this.xs = true;
      this.xsOnly = false;
      this.xsObservable.next(false);
      this.xsOnlyObservable.next(false);
    }
    if (window.innerWidth >= 576) {
      this.sm = true;
      this.smObservable.next(true);

    } else {
      this.sm = false;
      this.smObservable.next(false);
    }

    if (window.innerWidth >= 768) {
      this.md = true;
      this.mdObservable.next(true);
    } else {
      this.md = false;
      this.mdObservable.next(false);
    }
    if (window.innerWidth >= 992) {
      this.lg = true;
      this.lgObservable.next(true);
    } else {
      this.lg = false;
      this.lgObservable.next(false);
    }
    if (window.innerWidth >= 1200) {
      this.xl = true;
      this.xlObservable.next(true);
    } else {
      this.xl = false;
      this.xlObservable.next(false);
    }
    if (window.innerWidth >= 1600) {
      this.xxlObservable.next(true);
    } else {
      this.xxl = false;
      this.xxlObservable.next(false);
    }
  }
}
