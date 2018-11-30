import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Task from '../../dto/Task';
import { FileId } from '../../dto/FileId';

import { TaskService } from '../../service/task.service';
import { DisplayService } from '../../service/display.service';
import TaskFilter, { filterTasks } from '../task-filter/TaskFilter';

@Component({
  selector: 'app-task-selection',
  templateUrl: './task-selection.component.html',
  styleUrls: ['./task-selection.component.css']
})
export class TaskSelectionComponent implements OnInit {
  tasks: Task[];
  allTasks: Map<FileId, Task>;
  activeFilter: TaskFilter = {finished: false, tags: []};
  selectedTask?: Task;
  showSidePreview = false;

  @Output('selectedTask') onTask = new EventEmitter<Task>();

  constructor(private taskService: TaskService, public display: DisplayService) {
  }


  async ngOnInit() {
    await this.taskService.loadAllTasks();
    this.taskService.tasks.subscribe(files => {
      console.log('new tasks')
      this.allTasks = files;
      if (this.activeFilter) {
        this.onFilter(this.activeFilter);
      } else {
        this.tasks = Array.from(this.allTasks.values());
      }
    });
  }

  onFilter(filter: TaskFilter) {
    this.tasks = filterTasks(filter, this.allTasks, true);
    this.activeFilter = filter;
  }

  showPreview(task: Task) {
    this.selectedTask = task;
    if (this.display.md) {
      this.showSidePreview = true;
    }
  }

  selectTask(task: Task) {
    this.onTask.emit(task);
  }
}
