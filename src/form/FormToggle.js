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


import React, {Component} from "react"
import {CheckBox} from "grommet";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

@observer
export default class FormToggle extends Component {
  // @observable value = null;

  onChange = (val) => {
    const form = this.props.form;
    const field = form.select(this.props.name);
    const oldValue = field.get("value");
    console.log(oldValue)
    if (oldValue === undefined) {
      console.log("undefined")
      field.set("value", this.props.checked || false)
    } else {
      field.set("value", !oldValue)
    }
    console.log(field.get("value"))
  }

  render() {
    const {name, form, ...props} = this.props;
    return (
      <CheckBox
        {...form.select(name).bind()}
        // onDOMChange={form.select(name).sync}
        onChange={this.onChange}
        {...props}
      />
    );
  }
}