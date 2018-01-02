import * as React from 'react';
import Button from 'antd/lib/button';
import './App.css';
import {GlobalStore} from "./store/GlobalStore";
import Thought from "./dto/Thought";
import {Tag} from "./dto/Tag";
import TagContainer from "./ui/tag/TagContainer";
import {MarkdownEditor} from "./ui/editor/MarkdownEditor";

class App extends React.Component {

    render() {
        let thought = new Thought("test", [new Tag("bla")]);
        thought.content = '# hello\n world, **sauerland**'
        return (
            <div className="App">
                <Button type="primary">Button</Button>

                <TagContainer item={thought} store={new GlobalStore()}/>
                <MarkdownEditor item={thought}/>
            </div>
        );
    }
}

export default App;