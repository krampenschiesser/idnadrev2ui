/**
 * Created by scar on 4/15/17.
 */

import uuid from "uuid"
import {observable} from "mobx"

export default class IdnadrevFile {
  id=null
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