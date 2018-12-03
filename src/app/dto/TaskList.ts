import IdnadrevFile from './IdnadrevFile';
import { Tag } from './Tag';
import { FileType } from './FileType';
import { FileId } from './FileId';
import TaskFilter from '../task-filter/task-filter/TaskFilter';

export class ListDetails {
  sortings: ListSorting[] = [new ListSorting('updated',SortOrder.DESC)];
  manualSorting = false;
  filter?: TaskFilter;
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


export default class TaskList extends IdnadrevFile<ListDetails, FileId[]> {
  constructor(name: string, tags: Tag[] = []) {
    super(name, FileType.List);
    this.tags = tags;
    this.details = new ListDetails();
  }
}