import * as React from 'react';
import Icon from 'antd/lib/icon';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import Button from 'antd/lib/button/button';
import Thought from '../../dto/Thought';
import Document from '../../dto/Document';
import GlobalStore from '../../store/GlobalStore';
import Task from '../../dto/Task';
import moment from 'moment';
import { InputNumber, Modal } from 'antd';

export interface ThoughtActionProps {
  hoverColor?: string;
  asIcon?: boolean;
  thought: Thought;
  store: GlobalStore;
  reload: () => void;
}

class ThoughtAction extends React.Component<ThoughtActionProps, object> {
  @observable hover: boolean = false;
  icon: string;
  title: string;

  callback = (thought: Thought, store: GlobalStore): Promise<string> => {
    return new Promise(resolve => resolve());
  };

  constructor(callback: (thought: Thought, store: GlobalStore) => Promise<string>, icon: string, title: string, props: ThoughtActionProps) {
    super(props);
    this.callback = callback;
    this.icon = icon;
    this.title = title;
  }

  render() {
    let actionStyle = {fontSize: 20, marginRight: '10px', cursor: 'pointer'};
    if (this.hover) {
      let color = this.props.hoverColor ? this.props.hoverColor : '#1890ff';
      // tslint:disable-next-line
      actionStyle['color'] = color;
    }

    if (this.props.asIcon) {
      return (
        <span onMouseEnter={() => this.hover = true} onMouseLeave={() => this.hover = false}>
                    <Icon
                      onClick={() => this.callback(this.props.thought, this.props.store).then(() => this.props.reload())} style={actionStyle}
                      title={this.title}
                      type={this.icon}/>
                </span>
      );
    } else {
      return <Button icon={this.icon} onClick={() => this.callback(this.props.thought, this.props.store).then(() => this.props.reload())}>{this.title}</Button>;
    }
  }
}

@observer
export class ThoughtToTask extends ThoughtAction {
  constructor(props: ThoughtActionProps) {
    super(toTask, 'schedule', 'To Task', props);
  }
}

@observer
export class ThoughtToDocument extends ThoughtAction {
  constructor(props: ThoughtActionProps) {
    super(toDocument, 'book', 'To Document', props);
  }
}

@observer
export class PostponeThought extends React.Component<ThoughtActionProps, object> {

  @observable hover: boolean = false;
  icon: string = 'hourglass';
  title: string = 'Postpone';
  @observable
  showModal: boolean = false;
  @observable
  postponeDays: number = 7;

  render() {
    let actionStyle = {fontSize: 20, marginRight: '10px', cursor: 'pointer'};
    if (this.hover) {
      let color = this.props.hoverColor ? this.props.hoverColor : '#1890ff';
      // tslint:disable-next-line
      actionStyle['color'] = color;
    }

    let modal = (
      <Modal
        title="Postpone for how many days?"
        visible={this.showModal}
        onOk={() => {
          postponeThought(this.props.thought, this.props.store, this.postponeDays).then(() => {
            this.showModal = false;
            this.props.reload();
          });
        }}
        onCancel={() => this.showModal = false}
      >
        <InputNumber defaultValue={this.postponeDays} onChange={(days: number) => this.postponeDays = days}/>
      </Modal>
    );

    if (this.props.asIcon) {
      return (
        <div>
          {modal}
          <span onMouseEnter={() => this.hover = true} onMouseLeave={() => this.hover = false}>
                    <Icon
                      onClick={() => this.showModal = true} style={actionStyle}
                      title={this.title}
                      type={this.icon}/>
                </span>
        </div>
      );
    } else {
      return (
        <div>
          {modal}
          <Button icon={this.icon} onClick={() => this.showModal = true}>{this.title}</Button>
        </div>
      );
    }
  }
}

@observer
export class DeleteThought extends ThoughtAction {
  constructor(props: ThoughtActionProps) {
    super(deleteThought, 'delete', 'Delete', props);
  }
}

function toTask(thought: Thought, store: GlobalStore): Promise<string> {
  let task = new Task(thought.name, thought.tags, thought.content);
  task.repository=thought.repository;
  task.created=thought.created;
  task.updated=thought.updated;
  return store.store(task).then(() => {
    return store.markDeleted(thought);
  });
}

function toDocument(thought: Thought, store: GlobalStore): Promise<string> {
  let document = new Document(thought.name, thought.tags, thought.content);
  document.repository=thought.repository;
  document.created=thought.created;
  document.updated=thought.updated;
  return store.store(document).then(() => {
   return store.markDeleted(thought);
  });
}

function postponeThought(thought: Thought, store: GlobalStore, days?: number): Promise<string> {
  thought.details.showAgainAfter = moment().add(!days ? 7 : days, 'd').toDate();
  return store.store(thought);
}

function deleteThought(thought: Thought, store: GlobalStore): Promise<string> {
  return store.markDeleted(thought);
}