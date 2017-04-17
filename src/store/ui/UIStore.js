/**
 * Created by scar on 4/10/17.
 */

import {observable, action} from 'mobx';

import NavigationState from "./NavigationState.js"
import ThoughtOverviewState from "./ThoughtOverviewState.js"
import ProcessThoughtState from "./ProcessThoughtState.js"
import TaskOverviewState from "./../../task/overview/TaskOverviewState";

export default class UIStore {
    navigationState = new NavigationState();
    thoughtOverviewState = new ThoughtOverviewState();
    processThoughtState = new ProcessThoughtState();
    taskOverviewState = new TaskOverviewState();

    @observable mobile;
    firstTimeMobile = true;

    @observable showTooltips = true;

    @action
    toggleTooltips() {
        this.showTooltips = !this.showTooltips;
    }

    @action
    setMobile(mobile) {
        this.mobile = mobile;

        if (mobile && this.firstTimeMobile) {
            this.navigationState.setVisible(false);
            this.firstTimeMobile = false;
        }

    }
}
