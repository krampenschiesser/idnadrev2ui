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

import { v4 as uuid } from 'uuid';
import { FileType } from './FileType';
import { Tag } from './Tag';
import { FileId } from './FileId';
import { RepositoryId } from './RepositoryId';
import { observable } from 'mobx';

export default abstract class IdnadrevFile<Details, Content> {
  @observable repository: RepositoryId;
  id: FileId;
  version: number;
  @observable name: string;

  created: Date;
  updated: Date;
  deleted: Date;

  fileType: FileType;
  @observable tags: Tag[];

  @observable details: Details;
  @observable content: Content;

  constructor(name: string, fileType: FileType) {
    this.id = uuid();
    this.name = name;
    this.created = new Date();
    this.updated = this.created;
    this.version = 0;
    this.tags = [];
    this.fileType = fileType;
  }

  addTag(tag: Tag) {
    this.tags.push(tag);
  }

  isTextFile() {
    return typeof this.content === 'string';
  }

  withRepository(repository: RepositoryId): this {
    this.repository = repository;
    return this;
  }

}