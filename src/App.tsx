import * as React from 'react';
import './App.css';
import { GlobalStore } from './store/GlobalStore';
import { observer } from 'mobx-react';
import UiStore from './store/UiStore';
import WebStorage from './store/WebStorage';
import LocalCryptoStorage from './store/LocalCryptoStorage';
import Idnadrev from './Idnadrev';
import { BrowserLogin } from './ui/login/BrowserLogin';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const localCryptoStorage = new LocalCryptoStorage(null);
const webStorage = new WebStorage(localCryptoStorage);
const globalStore = new GlobalStore(webStorage);
const uiStore = new UiStore();

@observer
class App extends React.Component<{},{}> {
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
    if (localCryptoStorage.isLoggedIn) {
      return <Idnadrev store={globalStore} uiStore={uiStore}/>;
    } else {
      return <BrowserLogin cryptoStorage={localCryptoStorage}/>;
    }
  }
}

export default DragDropContext(HTML5Backend)(App);