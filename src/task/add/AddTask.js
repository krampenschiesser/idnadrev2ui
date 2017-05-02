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
import {
  Article, Box, Footer, Form, FormField, FormFields, Section
} from "grommet";
import SiteTitle from "../../navigation/SiteTitle";
import MobxReactFormDevTools from 'mobx-react-form-devtools';
import MobxReactForm from 'mobx-react-form';
import validatorjs from "validatorjs";
import TagFormEditor from "../../form/FormTagEditor";
import FormTextInput from "../../form/FormTextInput";
import FormMarkdownEditor from "../../form/FormMarkdownEditor";
import FormSubmitButton from "../../form/FormSubmitButton";

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
    label: 'Content',
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
        rules: 'date|required_with:to',
      }, {
        name: 'to',
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


  render() {
    const allTags = this.props.store.tags;
    return (
      <Article >
        <SiteTitle title="Add Task"/>
        <Section>
          <Box direction="row" full={true} justify="center" responsive={false}>
            <Form onSubmit={form.onSubmit}>
              <FormFields>
                <FormField label={form.$('name').label} error={form.$('name').error}>
                  <FormTextInput autoFocus={true} ref={(i) => this.nameInput = i} form={form}
                                 name="name"/>
                </FormField>
                <FormField label="Tags">
                  <TagFormEditor form={form} name="tags" allTags={allTags}/>
                </FormField>
                <FormField label="content">
                  <FormMarkdownEditor onSubmit={this.onSubmit} form={form} name="content"/>
                </FormField>
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