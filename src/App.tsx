import * as React from 'react';
import './App.css';
import {GlobalStore} from "./store/GlobalStore";
import Thought from "./dto/Thought";
import {Tag} from "./dto/Tag";
import TagContainer from "./ui/tag/TagContainer";
import {MarkdownEditor} from "./ui/editor/MarkdownEditor";
import {Provider} from 'mobx-react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import DevTools from "mobx-react-devtools";


const globalStore = new GlobalStore();

class App extends React.Component {

    render() {
        let thought = new Thought("test", [new Tag("bla")]);
        thought.content = '# hello\n world, **sauerland**'
        return (
            <div className="App">
                <Provider store={globalStore}>
                    <Router>
                        <Route/>
                    </Router>
                </Provider>
                <MarkdownEditor item={thought}/>
                <TagContainer item={thought} store={new GlobalStore()}/>
                <DevTools/>
            </div>
        );
    }
}

export default App;