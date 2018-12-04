import { Pipe, PipeTransform } from '@angular/core';
import { RepositoryService } from '../service/repository.service';
import { ContactService } from '../service/contact.service';
import { FileId } from '../dto/FileId';

@Pipe({
  name: 'delegation'
})
export class DelegationPipe implements PipeTransform {


  constructor(private contactService: ContactService) {
  }

  async transform(value: FileId, args?: any): Promise<string> {
    if (!value) {
      return '';
    }
    await this.contactService.loadAllOnce();
    let contact = await this.contactService.get(value);
    if (contact) {
      return contact.name;
    } else {
      return 'unknown';
    }
  }
}
