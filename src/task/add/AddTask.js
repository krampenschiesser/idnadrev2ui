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
import Task from "../../store/idnadrev/Task";
import {observer, inject} from 'mobx-react';
import {observable} from "mobx";
import {
  Article, Box, Footer, Form, FormField, FormFields, Section, Tab, Tabs
} from "grommet";
import SiteTitle from "../../navigation/SiteTitle";
import MobxReactFormDevTools from 'mobx-react-form-devtools';
import MobxReactForm from 'mobx-react-form';
import validatorjs from "validatorjs";
import TagFormEditor from "../../form/FormTagEditor";
import FormTextInput from "../../form/FormTextInput";
import FormMarkdownEditor from "../../form/FormMarkdownEditor";
import FormSubmitButton from "../../form/FormSubmitButton";
import FormRepoSelection from "../../form/FormRepoSelection";

const fields = {
  name: {
    label: 'Name',
    placeholder: 'Insert Name',
    rules: 'required|string',
  },
  tags: {
    label: 'Tags',
    rules: 'array',
  },
  content: {
    label: 'Content',
    rules: 'string',
  },

  state: {
    label: 'State',
    rules: 'string',
  },
  parent: {
    label: 'Parent',
    rules: 'string',
  },
  context: {
    label: 'Context',
    rules: 'string',
  },
  estimatedTime: {
    label: 'Estimated time',
    rules: 'number',
  },
  delegation: {
    label: 'Delegation',
    fields: [
      {
        name: 'time',
        label: 'Deletation Time',
        rules: 'date|required_with:to',
      }, {
        name: 'to',
        label: 'Delegated To',
        rules: 'string|required_with:time',
      },
    ]
  },
  scheduling: {
    label: 'Scheduling',
    fields: [
      {
        name: 'duration',
        rules: 'number|min:1',
      },
      {
        name: 'scheduledDateTime',
        rules: 'date|required_without:proposedDateTime',
      },
      {
        name: 'scheduledDateOnly',
        rules: 'boolean|required_with:scheduledDateTime',
      },
      {
        name: 'proposedDateTime',
        rules: 'date|required_without:scheduledDateTime',
      },
      {
        name: 'proposedDateOnly',
        rules: 'boolean|required_with:proposedDateTime',
      },
      {
        name: 'duration',
        rules: 'number|min:1',
      },
      {
        name: 'proposedYear',
        rules: 'number|min:1|required_without:proposedDateTime',
      },
      {
        name: 'proposedWeek',
        rules: 'number|min:1|required_with:proposedYear',
      },
      {
        name: 'proposedWeekDay',
        rules: 'number|min:1|max:7|required_with:proposedWeek',
      },
    ]
  },
  workUnits: {
    label: 'Work units',
    fields: [
      {
        name: 'start',
        rules: 'required|date',
      },
      {
        name: 'end',
        rules: 'date|after:start',
      }
    ]
  }
};

class AddTaskForm extends MobxReactForm {
  store = null;

  onSuccess(form) {
    const values = form.values();

    const thought = new Task(values.name);
    thought.tags = values.tags;
    thought.content = values.content;
    this.store.addFile(thought);
    form.reset();
  }

  onError(form) {
    form.invalidate('This is a generic error message!');
  }
}

const plugins = {dvr: validatorjs};
const form = new AddTaskForm({fields}, {plugins});
MobxReactFormDevTools.register({form});


@inject("uistore", "store")
@observer
export default class AddTask extends Component {
  @observable tabIndex = 0;

  componentDidMount() {
    form.store = this.props.store;
    this.refocus();
  }

  refocus() {
    this.nameInput.focus();
  }


  onSubmit = (e) => {
    e ? form.submit(e) : form.submit();
    this.refocus();
  }

  onTabSelect = (index) => {
    this.tabIndex = index
  }

  onFormKeyDown = (e) => {
    if(! e.altKey) {
      return;
    }
    let add = 0;
    if (e.key === "PageDown") {
      add = +1;
    } else if (e.key === "PageUp") {
      add = -1;
    } else {
      return
    }

    let temp = this.tabIndex + add;
    if (temp > 2) {
      temp = 0
    } else if (temp < 0) {
      temp = 2;
    }
    this.tabIndex = temp;
    e.stopPropagation()
  }

  render() {
    const allTags = this.props.store.tags;

    const main = (
      <Box>
        <FormField label={form.$('name').label} error={form.$('name').error}>
          <FormTextInput autoFocus={true} ref={(i) => this.nameInput = i} form={form}
                         name="name"/>
        </FormField>
        <FormField label="Tags">
          <TagFormEditor form={form} name="tags" allTags={allTags}/>
        </FormField>
        <FormField label="Content">
          <FormMarkdownEditor onSubmit={this.onSubmit} form={form} name="content"/>
        </FormField>
        <FormField label="Repository">
          <FormRepoSelection />
        </FormField>
      </Box>
    );

    const details = (
      <Box>
        <FormField label={form.$('context').label} error={form.$('context').error}>
          <FormTextInput autoFocus={true} form={form} name="context"/>
        </FormField>
        <FormField label={form.$('state').label} error={form.$('state').error}>
          <FormTextInput form={form} name="state"/>
        </FormField>
        <FormField label={form.$('parent').label} error={form.$('parent').error}>
          <FormTextInput form={form} name="parent"/>
        </FormField>
        <FormField label={form.$('estimatedTime').label} error={form.$('estimatedTime').error}>
          <FormTextInput form={form} name="estimatedTime"/>
        </FormField>
        <FormField label={form.$('delegation.to').label} error={form.$('delegation.to').error}>
          <FormTextInput form={form} name="delegation.to"/>
        </FormField>
      </Box>
    )

    const scheduling = (
      <Box>
        <FormField label={form.$('parent').label} error={form.$('parent').error}>
          <FormTextInput autoFocus={true} form={form} name="parent"/>
        </FormField>
      </Box>
    )

    return (
      <Article onKeyDown={this.onFormKeyDown}>
        <SiteTitle title="Add Task"/>
        <Section>
          <Box direction="row" full={true} justify="center" responsive={false}>
            <Form onSubmit={form.onSubmit}>
              <FormFields >
                <Tabs responsive={false} activeIndex={this.tabIndex} onActive={this.onTabSelect}>
                  <Tab title='Main'>
                    {main}
                  </Tab>
                  <Tab title='Details'>
                    {details}
                  </Tab>
                  <Tab title='Scheduling'>
                    {scheduling}
                  </Tab>
                </Tabs>
              </FormFields>
              <Footer>
                <FormSubmitButton onClick={this.onSubmit} form={form}/>
              </Footer>
            </Form>
          </Box>
        </Section>
      </Article>
    );
  }
}