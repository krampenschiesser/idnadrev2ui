import * as React from 'react';
import './App.css';
import {GlobalStore} from './store/GlobalStore';
import {observer, Provider} from 'mobx-react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

// import DevTools from "mobx-react-devtools";
import {NavigationContainer} from './ui/NavigationContainer';
import {AddThought} from './ui/thought/AddThought';
import UiStore from './store/UiStore';
import ViewThoughts from './ui/thought/ViewThought';
import ProcessThoughts from './ui/thought/ProcessThoughts';


export interface IdnadrevProps {
    store: GlobalStore;
    uiStore: UiStore;
}

@observer
class Idnadrev extends React.Component<IdnadrevProps, any> {
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
            <div className="App">
                <Provider store={store} uiStore={uiStore}>
                    <Router>
                        <NavigationContainer uiStore={uiStore}>
                            <Route exact path='/thought' component={ViewThoughts}/>
                            <Route path='/thought/add' component={AddThought}/>
                            <Route path='/thought/process' component={ProcessThoughts}/>

                            <Route exact path='/doc'/>
                            <Route path='/doc/edit'/>

                            <Route exact path='/task'/>
                            <Route path='/task/edit'/>

                            <Route exact path='/repo'/>
                            <Route path='/repo/login'/>
                            <Route path='/repo/create'/>
                        </NavigationContainer>
                    </Router>
                </Provider>
                {/*<DevTools/>*/}
            </div>
        );
    }
}

export default Idnadrev;