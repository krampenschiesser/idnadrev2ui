import * as React from 'react';
import Button from 'antd/lib/button';
import './App.css';
import {AddTag} from "./ui/common/AddTag";
import {GlobalStore} from "./store/GlobalStore";

class App extends React.Component {
  addTag = (val: string) => {
    console.log(val)
  }

  render() {
    return (
      <div className="App">
        <Button type="primary">Button</Button>
        <AddTag onAdd={this.addTag} store={new GlobalStore()}/>
      </div>
    );
  }
}

export default App;