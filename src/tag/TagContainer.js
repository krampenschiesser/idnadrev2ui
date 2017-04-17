/**
 * Created by scar on 4/9/17.
 */

import React, {Component} from "react";
import {Label, Box} from "grommet";
import Tag from "./Tag";
import FormTrashIcon from 'grommet/components/icons/base/FormTrash';

export default class TagContainer extends Component {
  render() {
    const tags = this.getTagsSorted();
    const editable = this.props.onRemove || false;

    return (
      <Box style={this.props.style} responsive={false} pad="none" align="baseline" direction="row">
        {this.props.showLabel &&
        <Label margin={this.props.margin}>Tags:</Label>
        }
        {tags.map(tag => {
          return <Tag key={tag} tag={tag} icon={editable ? <FormTrashIcon/> : null}
                      onClick={editable ? () => this.props.onRemove(tag) : null}/>;
        })
        }
      </Box>
    );
  }

  getTagsSorted() {
    let set = new Set();
    if (this.props.tags) {
      for (let tag of this.props.tags) {
        set.add(tag);
      }
    }
    let tags = Array.from(set);
    tags.sort();
    return tags;
  }
}