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

import React, {Component} from 'react';
import '../node_modules/grommet-css';
import "../node_modules/codemirror/lib/codemirror.css";
// import "../node_modules/codemirror/mode/markdown/markdown";

import {
  BrowserRouter as Router,
  Route,
  browserHistory,
} from 'react-router-dom'

import DocumentOverview from "./document/DocumentOverview.js"
import ViewSingleThought from "./thought/process/ProcessThoughts.js"
import ThoughtOverView from "./thought/overview/ThoughtOverview.js"

import Responsive from 'grommet/utils/Responsive';
import {observer, Provider} from "mobx-react";
import UIStore from "./store/ui/UIStore.js"
import SiteContent from "./navigation/SiteContent.js"
import Idnadrev from "./Idnadrev.js"
import AddThought from "./thought/add/AddThought";
import DevTools from "mobx-react-devtools";
import MobxReactFormDevTools from 'mobx-react-form-devtools';
import ReactTooltip from "react-tooltip"
import TaskOverview from "./task/overview/TaskOverview";
import IdnadrevStore from "./store/idnadrev/IdnadrevStore";
import AddTask from "./task/add/AddTask";
import RepoOverview from "./repo/RepoOverview";
import RepoLogin from "./repo/RepoLogin";
import RepoCreate from "./repo/RepoCreate";


const store = new IdnadrevStore();
const uiStore = new UIStore();

@observer
class App extends Component {
  constructor(props) {
    super(props);
    this._onResponsive = this._onResponsive.bind(this);
  }

  componentDidMount() {
    store.loadLocal()
    this._responsive = Responsive.start(this._onResponsive);
  }

  componentWillUnmount() {
    this._responsive.stop();
  }

  _onResponsive(small) {
    if (small)
      console.log("We are now mobile");
    else
      console.log("We are now desktop");

    uiStore.setMobile(small);
  }

  render() {
    return (
      <div>
        <Provider store={store} uistore={uiStore}>
          <Router history={browserHistory}>
            <Idnadrev uistore={uiStore}>
              <Route exact path="/" component={SiteContent}/>
              <Route path="/thought/process" component={ViewSingleThought}/>
              <Route path="/thought/add" component={AddThought}/>
              <Route exact path="/thought" component={ThoughtOverView}/>
              <Route path="/task/add" component={AddTask}/>
              <Route exact path="/task" component={TaskOverview}/>
              <Route path="/doc" component={DocumentOverview}/>
              <Route path="/repo/login/:id" component={RepoLogin}/>
              <Route path="/repo/create" component={RepoCreate}/>
              <Route exact path="/repo" component={RepoOverview}/>
            </Idnadrev>
          </Router>
        </Provider>
        <ReactTooltip />
        <DevTools/>
        <MobxReactFormDevTools.UI />
      </div>
    );
  }
}

export default App;
