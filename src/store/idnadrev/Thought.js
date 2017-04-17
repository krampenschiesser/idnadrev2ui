/**
 * Created by scar on 4/10/17.
 */
import IdnadrevFile from "./IdnadrevFile";

export default class Thought extends IdnadrevFile {
  constructor(name,tags=[],content='') {
    super(name, 'THOUGHT')
    this.tags=tags
    this.content=content
  }
}