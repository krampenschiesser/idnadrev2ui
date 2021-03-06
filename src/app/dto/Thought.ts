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

import IdnadrevFile from './IdnadrevFile';
import { FileType } from './FileType';
import { Tag } from './Tag';
import * as moment from 'moment';

export class ThoughtDetails {
  showAgainAfter?: Date;
}

export default class Thought extends IdnadrevFile<ThoughtDetails, string> {
  constructor(name: string, tags: Tag[] = [], content: string = '') {
    super(name, FileType.Thought);
    this.tags = tags;
    this.content = content;
    this.details = new ThoughtDetails();
  }

  get isPostPoned(): boolean {
    if (this.details.showAgainAfter) {
      return moment(this.details.showAgainAfter).isAfter(moment());
    }
    return false;
  }

  withContent(content: string): Thought {
    this.content = content;
    return this;
  }
}