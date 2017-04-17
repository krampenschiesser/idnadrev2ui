/**
 * Created by scar on 4/12/17.
 */

import {observable,action} from "mobx"

export default class ProcessThoughtState {
    @observable current = null;

    @action
    setCurrentThought(thought) {
        this.current = thought;
    }
}