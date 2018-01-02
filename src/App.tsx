import * as React from 'react';
import Button from 'antd/lib/button';
import './App.css';
import {GlobalStore} from "./store/GlobalStore";
import Thought from "./dto/Thought";
import {Tag} from "./dto/Tag";
import TagContainer from "./ui/common/TagContainer";

class App extends React.Component {

  render() {
    let thought = new Thought("test",[new Tag("bla")]);
    return (
      <div className="App">
        <Button type="primary">Button</Button>

        <TagContainer item={thought} store={new GlobalStore()}/>
      </div>
    );
  }
}

export default App;