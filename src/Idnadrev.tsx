import * as React from 'react';
import './App.css';
import { GlobalStore } from './store/GlobalStore';
import { observer, Provider } from 'mobx-react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import DevTools from 'mobx-react-devtools';
import { NavigationContainer } from './ui/NavigationContainer';
import { AddThought } from './ui/thought/AddThought';
import UiStore from './store/UiStore';
import ViewThoughts from './ui/thought/ViewThought';
import ProcessThoughts from './ui/thought/ProcessThoughts';
import ViewTask from './ui/task/ViewTask';
import { AddTask } from './ui/task/AddTask';
import LocaleProvider from 'antd/lib/locale-provider';
import en_US from 'antd/lib/locale-provider/en_US';
import moment from 'moment';
import PlanTask from './ui/task/PlanTask';
import ViewDocument from './ui/document/ViewDocument';
import { AddDocument } from './ui/document/AddDocument';
import { AddFile } from './ui/file/AddFile';
import ViewRepositories from './ui/repo/ViewRepositories';
import RepositoryLogin from './ui/repo/RepositoryLogin';

moment.locale('en');

export interface IdnadrevProps {
  store: GlobalStore;
  uiStore: UiStore;
}

@observer
class Idnadrev extends React.Component<IdnadrevProps, object> {
  updateDimensions = () => {
    if (window) {
      this.props.uiStore.updateWidth(window.innerWidth, window.innerHeight);
    }
  };

  componentDidMount() {
    this.updateDimensions();
    if (window) {
      window.addEventListener('resize', this.updateDimensions.bind(this));
    }
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('resize', this.updateDimensions.bind(this));
    }
  }

  render() {
    let uiStore = this.props.uiStore;
    let store = this.props.store;
    return (
      <div className='App'>
        <Provider store={store} uiStore={uiStore} antLocale={en_US}>
          <Router>
            <LocaleProvider locale={en_US}>
              <NavigationContainer uiStore={uiStore}>
                <Route exact path='/thought' component={ViewThoughts}/>
                <Route path='/thought/add' component={AddThought}/>
                <Route path='/thought/process' component={ProcessThoughts}/>

                <Route exact path='/doc' component={ViewDocument}/>
                <Route path='/doc/add' component={AddDocument}/>
                <Route path='/file/add' component={AddFile}/>

                <Route exact path='/task' component={ViewTask}/>
                <Route path='/task/edit' component={AddTask}/>
                <Route path='/task/add' component={AddTask}/>
                <Route path='/task/plan' component={PlanTask}/>

                <Route exact path='/repo' component={ViewRepositories}/>
                <Route path='/repo/login/:repoId' component={RepositoryLogin} />
                <Route path='/repo/create'/>
              </NavigationContainer>
            </LocaleProvider>
          </Router>
        </Provider>
        <DevTools/>
      </div>
    );
  }
}

export default Idnadrev;