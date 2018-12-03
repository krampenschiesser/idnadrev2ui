import IdnadrevFileFilter, { filterFiles } from '../../filter/IdnadrevFileFilter';
import Task from '../../dto/Task';
import * as moment from 'moment';
import { FileId } from '../../dto/FileId';

export default interface TaskFilter extends IdnadrevFileFilter {
  finished?: boolean;
  state?: string;
  remainingTime?: number;
  actionable?: boolean;
  project?: boolean;
  earliestStartDate?: Date;
}

export function filterTasks(filter: TaskFilter, allTasks: Map<FileId,Task>, addParents: boolean): Task[] {
  console.log('before filtering',Array.from(allTasks.values()).map(t=>t.id))
  let tasks = new Set();

  let taskFilter = (task: Task) => {
    let valid = true;
    if (filter.finished) {
      valid = task.isFinished;
    } else {
      valid = !task.isFinished;
    }
    if (filter.state) {
      if (task.state) {
        valid = valid && filter.state.toLocaleLowerCase() === task.state.toLocaleLowerCase();
      } else {
        valid = valid && filter.state.toLocaleLowerCase() === 'none';
      }
    }
    if (filter.actionable) {
      valid = valid && task.isActionable();
    }
    if (filter.project) {
      valid = valid && task.isProject();
    }
    if (filter.earliestStartDate) {
      valid = valid && moment(task.details.earliestStartDate).isAfter(moment(task.details.earliestStartDate));
    }
    if (filter.remainingTime) {
      let remainingTask = task.getRemainingTime();
      if (remainingTask) {
        valid = valid && remainingTask < filter.remainingTime;
      } else {
        valid = false;
      }
    }

    return valid;
  };

  filterFiles(Array.from(allTasks.values()), filter, taskFilter).forEach(t => tasks.add(t));

  if (addParents) {
    const addParent = (parents: Task[], id?: FileId) => {
      if (id) {
        let parent = allTasks.get(id);
        if (parent && !tasks.has(parent)) {
          parents.push(parent);
        }
      }
    };

    Array.from(tasks).forEach(t => {
      let parents: Task[] = [];
      addParent(parents, t.parent);
      while (parents.length !== 0) {
        let parent = parents.splice(0, 1)[0];
        tasks.add(parent);
        addParent(parents, parent.parent);
      }
    });
  }console.log('after filtering',Array.from(tasks).map(t=>t.id))
  return Array.from(tasks);
}