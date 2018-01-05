import * as React from 'react';
import './App.css';
import {GlobalStore} from './store/GlobalStore';
import Thought from './dto/Thought';
import {Tag} from './dto/Tag';
// import TagContainer from "./ui/tag/TagContainer";
// import {MarkdownEditor} from "./ui/editor/MarkdownEditor";
import {Provider} from 'mobx-react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

// import DevTools from "mobx-react-devtools";
import {NavigationContainer} from './ui/NavigationContainer';
import {AddThought} from './ui/thought/AddThought';
import UiStore from './store/UiStore';


const globalStore = new GlobalStore();
const uiStore = new UiStore();

class App extends React.Component {
    updateDimensions() {
        if (window) {
            uiStore.updateWidth(window.innerWidth, window.innerHeight);
        }
    }

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
        let thought = new Thought('test', [new Tag('bla')]);
        thought.content = '# hello\n world, **sauerland**';
        return (
            <div className="App">
                <Provider store={globalStore} uiStore={uiStore}>
                    <Router>
                        <NavigationContainer uiStore={uiStore}>
                            <Route exact path='/thought'/>
                            <Route path='/thought/add' component={AddThought}/>
                            <Route path='/thought/process'/>

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
                {/*<MarkdownEditor item={thought}/>*/}
                {/*<TagContainer item={thought} store={new GlobalStore()}/>*/}
                {/*<DevTools/>*/}
            </div>
        );
    }
}

export default App;