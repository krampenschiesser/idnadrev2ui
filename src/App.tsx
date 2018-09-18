import * as React from 'react';
import './App.css';
import GlobalStore from './store/GlobalStore';
import { observer } from 'mobx-react';
import UiStore from './store/UiStore';
import WebStorage from './store/WebStorage';
import Idnadrev from './Idnadrev';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const webStorage = new WebStorage();
const globalStore = new GlobalStore(webStorage);
const uiStore = new UiStore();

@observer
class App extends React.Component<{}, {}> {

  updateDimensions = () => {
    if (window) {
      uiStore.updateWidth(window.innerWidth, window.innerHeight);
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
    return <Idnadrev store={globalStore} uiStore={uiStore}/>;
  }
}

export default DragDropContext(HTML5Backend)(App);