import IdnadrevFile from './IdnadrevFile';
import { Tag } from './Tag';
import { FileType } from './FileType';

export class ContactDetails {
  firstName: string;
  lastName: string;
  middleName?: string;
  company?: string;
  jobTitle?: string;
  emails: string[];
  phones: string[];
  addresses: string[];
  birthday?: Date;
}

export interface CustomField {
  label: string;
  value: string;
}

export default class Contact extends IdnadrevFile<ContactDetails, CustomField[]> {
  constructor(name: string, tags: Tag[] = []) {
    super(name, FileType.Contact);
    this.tags = tags;
    this.details = new ContactDetails();

    let firstWhiteSpace = this.name.indexOf(' ');
    if (firstWhiteSpace > 0) {
      this.details.firstName = this.name.substr(0, firstWhiteSpace);
      this.details.lastName = this.name.substr(firstWhiteSpace);
    } else {
      this.details.firstName = this.name;
      this.details.lastName = this.name;
    }
  }

}