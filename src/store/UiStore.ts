import {action, computed, observable} from 'mobx';

export enum UiWidth {
    xs,
    sm,
    md,
    lg,
    xl,
    xxl
}
export enum UiOrientation {
    Landscape,
    Portrait
}

export default class UiStore {
    @observable uiWidth: UiWidth = UiWidth.lg;
    @observable uiOrientation = UiOrientation.Landscape;
    @observable path: string = '/';

    @action
    updateWidth(width: number, height: number) {
        if (width < 576) {
            this.uiWidth = UiWidth.xs;
        } else if (width < 768) {
            this.uiWidth = UiWidth.sm;
        } else if (width < 992) {
            this.uiWidth = UiWidth.md;
        } else if (width < 1200) {
            this.uiWidth = UiWidth.lg;
        } else if (width < 1600) {
            this.uiWidth = UiWidth.xl;
        } else {
            this.uiWidth = UiWidth.xxl;
        }
        console.log(this.uiWidth)
    }

    @computed get isMobile(): boolean {
        return this.uiWidth === UiWidth.xs;
    }

}