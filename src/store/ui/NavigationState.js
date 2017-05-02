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


import {observable, action} from 'mobx';

class NavItem {
    @observable name;
    @observable path;
    @observable subTree;

    constructor(name, path, subTree = null) {
        this.name = name;
        this.path = path;
        this.subTree = subTree;
    }
}


class NavTree {
    @observable name;
    back;

    constructor(name, back) {
        this.name = name;
        this.back = back;
    }

    @observable items = [];

    canGoBack() {
        return this.back;
    }
}
const MainTree = new NavTree("Menu", null);
const ThoughtTree = new NavTree("Thoughts", MainTree);
const TaskTree = new NavTree("Tasks", MainTree);

MainTree.items = [
    new NavItem("Thoughts", "/thought", ThoughtTree),
    new NavItem("Tasks", "/task", TaskTree),
    new NavItem("Documents", "/doc"),
    new NavItem("Repositories", "/repo"),
];

ThoughtTree.items = [
    new NavItem("Overview", "/thought"),
    new NavItem("Process", "/thought/process"),
    new NavItem("Add", "/thought/add"),
];
TaskTree.items = [
    new NavItem("Overview", "/task"),
    new NavItem("Add", "/task/add"),
];

export default class NavigationState {
    @observable visible = true;
    @observable tree = MainTree;

    @action
    setTree(tree) {
        this.tree = tree;
    }

    @action
    setVisible(visible) {
        this.visible = visible;
    }

    @action
    show() {
        this.visible = true;
    }

    @action
    hide() {
        this.visible = false;
    }
    @action
    toggleVisibility() {
        this.visible = !this.visible;
    }
}