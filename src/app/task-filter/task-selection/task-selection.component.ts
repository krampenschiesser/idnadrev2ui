import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class TaskSelectionComponent implements OnInit, AfterViewInit {
  tasks: Task[];
  allTasks: Map<FileId, Task>;
  activeFilter: TaskFilter = {finished: false, tags: []};
  selectedTask?: Task;

  _load = true;

  @Output('selectedTask') onTask = new EventEmitter<Task>();
  givenTasks = [];

  constructor(private taskService: TaskService, public display: DisplayService) {
  }

  @Input() set load(load: boolean) {
    console.log('setting load ',load)
    if (load) {
      this.loadContent();
    }
    this._load = load;
  }

  @Input('tasks') set given(g: Task[]) {
    this.givenTasks = g;
    if (this.allTasks) {
      this.onFilter(this.activeFilter);
    }
  }

  ngAfterViewInit(): void {
    console.log('init ',this._load)
    if (this._load) {
      this.loadContent();
    }
  }

  async loadContent() {
    await this.taskService.loadAllTasks();
    this.taskService.tasks.subscribe(files => {
      this.allTasks = files;
      this.onFilter(this.activeFilter);
    });
  }

  ngOnInit() {
  }

  onFilter(filter: TaskFilter) {
    let temp = filterTasks(filter, this.allTasks, true);
    if (this.givenTasks.length > 0) {
      let set = new Set(this.givenTasks.map(t => t.id));
      temp = temp.filter(t => !set.has(t.id));
    }
    this.tasks = temp;
    this.activeFilter = filter;
  }

  selectTask(task: Task) {
    this.onTask.emit(task);
  }

  showPreview(task) {
    this.selectedTask = task;
  }

}
