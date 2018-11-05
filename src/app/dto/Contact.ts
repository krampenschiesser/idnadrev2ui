import IdnadrevFile from './IdnadrevFile';
import { Tag } from './Tag';
import { FileType } from './FileType';

export class ContactDetails {
  firstName: string = '';
  lastName: string = '';
  middleName?: string;
  company?: string;
  jobTitle?: string;
  emails: string[] = [];
  phones: string[] = [];
  addresses: string[] = [];
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
      this.details.lastName = this.name.substr(firstWhiteSpace+1);
    } else {
      this.details.firstName = this.name;
      this.details.lastName = this.name;
    }
  }

  get phoneNumber() {
    if (this.details.phones.length === 0) {
      return '';
    } else {
      return this.details.phones[0];
    }
  }

  get email() {
    if (this.details.emails.length === 0) {
      return '';
    } else {
      return this.details.emails[0];
    }
  }

  get initial() {
    let initial = '';
    if (this.details.firstName.length > 0) {
      initial = this.details.firstName.substr(0, 1);
    }
    if (this.details.lastName.length > 0) {
      initial += '.' + this.details.lastName.substr(0, 1);
    }
    return initial;
  }
}