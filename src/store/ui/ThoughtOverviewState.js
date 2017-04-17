/**
 * Created by scar on 4/12/17.
 */
import {observable, action} from "mobx";

export default class ThoughtOverviewState {
    @observable selectedThought;
    @observable showHoverPreview = true;

    @action
    selectThought(thought) {
        this.selectedThought = thought;
    }

    @action
    toggleHoverPreview() {
        this.showHoverPreview = !this.showHoverPreview;
    }
    @action
    setHoverPreview(enabled) {
        this.showHoverPreview = enabled;
    }
}
