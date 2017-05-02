/*
 * Copyright 2017 Christian Löhnert. See the COPYRIGHT
 * file at the top-level directory of this distribution.
 *
 * Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
 * http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
 * <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
 * option. This file may not be copied, modified, or distributed
 * except according to those terms.
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
