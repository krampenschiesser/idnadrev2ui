import IdnadrevFile from './IdnadrevFile';
import { Tag } from './Tag';
import { FileType } from './FileType';
import { FileId } from './FileId';

export class ListDetails {
  sortings: ListSorting[] = [new ListSorting('updated',SortOrder.DESC)];
  manualSorting = false;
}

export class ListSorting {
  fieldName: string;
  order: SortOrder;

  constructor(fieldName: string, order: SortOrder) {
    this.fieldName = fieldName;
    this.order = order;
  }
}

export enum SortOrder {
  ASC,DESC
}


export default class List extends IdnadrevFile<ListDetails, FileId[]> {
  constructor(name: string, tags: Tag[] = []) {
    super(name, FileType.List);
    this.tags = tags;
    this.details = new ListDetails();
  }

}