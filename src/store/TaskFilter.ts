import { TaskContext, TaskState } from '../dto/Task';
import { FileId } from '../dto/FileId';
import { Tag } from '../dto/Tag';

export interface TaskFilter {
  //db filters
  finished?: boolean;
  delegated?: boolean;
  context?: TaskContext;
  state?: TaskState;

  //all filters
  name?: string;
  delegatedTo?: string;
  parent?: FileId;

  scheduled?: boolean;
  proposed?: boolean;
  remainingTimeLessThen?: number;

  tags?: Tag[];
}