import {observer} from 'mobx-react';
import * as React from 'react';
import {Row, Col, AutoComplete, Tag} from 'antd';
import IdnadrevFile from '../../dto/IdnadrevFile';
import {GlobalStore} from '../../store/GlobalStore';
import {observable} from 'mobx';
import {Tag as FileTag} from '../../dto/Tag';

export class TagContainerProps {
    item: IdnadrevFile<any, any>;
    store: GlobalStore;
}

@observer
export default class TagContainer extends React.Component<TagContainerProps, object> {
    @observable
    private possibleTags: string[];
    @observable
    private fileTags: string[];


    constructor(props: TagContainerProps, context: any) {
        super(props, context);
        this.possibleTags = props.store.getTagsStartingWith('');
        this.fileTags = props.item.tags.map(tag => tag.name);
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
        if (!this.fileTags.find((val => val.toLocaleLowerCase() == tag.toLocaleLowerCase()))) {
            this.fileTags.push(tag);
            this.props.item.tags.push(new FileTag(tag));
        }
        console.log(this.fileTags);
    };

    removeTag = (tag: string) => {
        this.fileTags = this.fileTags.filter(e => e !== tag);
        this.props.item.tags = this.props.item.tags.filter(e => e.name !== tag);
    };

    render() {
        let autocomplete = <AutoComplete dataSource={this.possibleTags} onSearch={this.updatePossibleTags}
                                         onSelect={this.addTag}/>;

        return (
            <Row>
                <Col xs={24} md={6}>{autocomplete}</Col>
                {this.fileTags.map(e => <Tag key={e} closable onClose={() => this.removeTag(e)}>{e}</Tag>)}
            </Row>
        );
    }
}