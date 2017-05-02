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


export function navState(obj) {
    return obj.props.uistore.navigationState;
}

export function navVisible(obj) {
    return navState(obj).visible;
}
export function navTree(obj) {
    return navState(obj).tree;
}


export function thoughtOverviewState(obj) {
    return obj.props.uistore.thoughtOverviewState;
}

export function showTooltips(obj) {
    return uistore(obj).showTooltips;

}
export function getSelectedThought(obj) {
    return thoughtOverviewState(obj).selectedThought;
}
export function isThoughtPreviewEnabled(obj) {
    return thoughtOverviewState(obj).showHoverPreview;
}

export function processThoughtState(obj) {
    return obj.props.uistore.processThoughtState;
}
export function currentProcessThought(obj) {
    return processThoughtState(obj).current;
}

export function isDesktop(obj) {
    return !isMobile(obj)
}

export function isMobile(obj) {
    return obj.props.uistore.mobile;
}
export function uistore(obj) {
    return obj.props.uistore;
}

export function allTasks(obj) {
    return obj.props.store.getAllTasks;
}

export function taskTree(obj) {
    return obj.props.store.getTaskTree;
}

export function taskOverViewState(obj) {
    return obj.props.uistore.taskOverviewState
}
