import { observer } from 'mobx-react';
import * as React from 'react';
import { AutoComplete, Tag } from 'antd';
import IdnadrevFile from '../../dto/IdnadrevFile';
import { GlobalStore } from '../../store/GlobalStore';
import { observable } from 'mobx';
import { Tag as FileTag } from '../../dto/Tag';

export class TagContainerProps {
  item: IdnadrevFile<{}, {}> | FileTag[];
  store: GlobalStore;
}

@observer
export default class TagContainer extends React.Component<TagContainerProps, object> {
  @observable
  private possibleTags: string[];
  @observable
  private fileTags: string[];

  constructor(props: TagContainerProps) {
    super(props);
    this.possibleTags = props.store.getTagsStartingWith('');
    console.log(this.possibleTags)

    if (props.item instanceof IdnadrevFile) {
      this.fileTags = props.item.tags.map(tag => tag.name);
    } else if (this.props.item instanceof Array) {
      this.fileTags = this.props.item.map(t => t.name);
    }
  }

  updatePossibleTags = (tag: string) => {
    let tagsStartingWith = this.props.store.getTagsStartingWith(tag);
    if (tag && tagsStartingWith.indexOf(tag) < 0) {
      this.possibleTags = [tag].concat(tagsStartingWith);
    } else {
      this.possibleTags = tagsStartingWith;
    }
  };

  addTag = (tag: string) => {
    if (!this.fileTags.find((val => val.toLocaleLowerCase() === tag.toLocaleLowerCase()))) {
      this.fileTags.push(tag);

      if (this.props.item instanceof IdnadrevFile) {
        this.props.item.tags.push(new FileTag(tag));
      } else if (this.props.item instanceof Array) {
        this.props.item.push(new FileTag(tag));
      }
    }
    console.log(this.fileTags);
  };

  removeTag = (tag: string) => {
    this.fileTags = this.fileTags.filter(e => e !== tag);
    if (this.props.item instanceof IdnadrevFile) {
      this.props.item.tags = this.props.item.tags.filter(e => e.name !== tag);
    } else if (this.props.item instanceof Array) {
      let copy = this.props.item.splice(0, this.props.item.length);

      copy.filter(e => e.name !== tag).forEach(e => {
        if (this.props.item instanceof Array) {
          this.props.item.push(e);
        }
      });
    }
  };

  render() {
    let autocomplete = <AutoComplete dataSource={this.possibleTags} onSearch={this.updatePossibleTags} onSelect={this.addTag}/>;

    return (
      <div>
        {autocomplete}
        {this.fileTags.map(e =>
          <Tag color={this.props.store.getTagColor(e)} key={e} closable onClose={() => this.removeTag(e)}>
            <span style={{fontSize: 16, fontWeight: 'bold'}}>{e}</span>
          </Tag>)}
      </div>
    );
  }
}