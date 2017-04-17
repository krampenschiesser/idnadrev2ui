/**
 * Created by scar on 4/15/17.
 */

export default class Document extends IdnadrevFile {
  constructor(name,tags=[],content='') {
    super(name, 'DOCUMENT')
    this.tags=tags
    this.content=content
  }
}