import IdnadrevFile from './IdnadrevFile';
import { Tag } from './Tag';
import { FileType } from './FileType';

export class TemplateDetails {
}

export default class Template extends IdnadrevFile<TemplateDetails, string> {
  constructor(name: string, tags: Tag[] = []) {
    super(name, FileType.Template);
    this.tags = tags;
    this.details = new TemplateDetails();
  }

}