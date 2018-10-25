import { Pipe, PipeTransform } from '@angular/core';
import { FileType } from '../dto/FileType';

@Pipe({
  name: 'fileType'
})
export class FileTypePipe implements PipeTransform {

  transform(value: FileType, args?: any): string {
    console.log(value)
    if (value === FileType.Binary) {
      return 'Binary';
    } else if (value === FileType.Thought) {
      return 'Thought';
    } else if (value === FileType.Document) {
      return 'Document';
    } else if (value === FileType.Task) {
      return 'Task';
    }
    return 'Unknown';
  }

}
