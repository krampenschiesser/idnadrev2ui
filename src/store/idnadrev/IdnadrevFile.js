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


import uuid from "uuid"
import {observable} from "mobx"

export default class IdnadrevFile {
  id=null
  @observable repository
  @observable name
  @observable created
  @observable updated
  @observable deleted
  @observable version
  @observable tags
  @observable fileType
  @observable details
  @observable content


  constructor(name,fileType) {
    this.id=uuid.v4()
    this.name=name
    this.created=new Date()
    this.updated=new Date()
    this.version=0
    this.tags=[]
    this.fileType=fileType
    this.details=null
  }


  addTag(tag) {
    this.tags.push(tag);
  }
}