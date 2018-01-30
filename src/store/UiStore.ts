import { action, computed, observable } from 'mobx';

export enum UiWidthClass {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl'
}

export enum UiWidthDimension {
  xs = 0,
  sm = 576,
  md = 768,
  lg = 992,
  xl = 1200,
  xxl = 1600,
}

export enum UiOrientation {
  Landscape,
  Portrait
}

export default class UiStore {
  @observable uiWidthClass: UiWidthClass = UiWidthClass.lg;
  @observable uiWidth: number = 992;
  @observable uiHeight: number = 800;
  @observable uiOrientation = UiOrientation.Landscape;
  @observable header: string = '';

  @action
  updateWidth(width: number, height: number) {
    if (width < UiWidthDimension.sm) {
      this.uiWidthClass = UiWidthClass.xs;
    } else if (width < UiWidthDimension.md) {
      this.uiWidthClass = UiWidthClass.sm;
    } else if (width < UiWidthDimension.lg) {
      this.uiWidthClass = UiWidthClass.md;
    } else if (width < UiWidthDimension.xl) {
      this.uiWidthClass = UiWidthClass.lg;
    } else if (width < UiWidthDimension.xxl) {
      this.uiWidthClass = UiWidthClass.xl;
    } else {
      this.uiWidthClass = UiWidthClass.xxl;
    }
    this.uiWidth = width;
    this.uiHeight = height;

    if (width > height) {
      this.uiOrientation = UiOrientation.Landscape;
    } else {
      this.uiOrientation = UiOrientation.Portrait;
    }
  }

  @computed get isMobile(): boolean {
    return this.uiWidthClass === UiWidthClass.xs;
  }

  @computed get displaysize(): string {
    return this.uiWidthClass.toString();
  }

}