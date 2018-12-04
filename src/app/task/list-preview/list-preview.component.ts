import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import TaskList from '../../dto/TaskList';
import { DisplayService } from '../../service/display.service';
import Task from '../../dto/Task';
import { TaskService } from '../../service/task.service';
import { Router } from '@angular/router';
import { FileId } from '../../dto/FileId';

@Component({
  selector: 'app-list-preview',
  templateUrl: './list-preview.component.html',
  styleUrls: ['./list-preview.component.css']
})
export class ListPreviewComponent implements OnInit {
  tasks?: Task[];
  original?: Task[];
  @Input() manualSorting = false;
  @Output() reorder = new EventEmitter<RowChange>();

  constructor(public display: DisplayService, private taskService: TaskService, private router: Router) {
  }

  @Input('tasks') set setTasks(t: Task[]) {
    this.tasks = t;
    this.original = t.slice();
  }

  async ngOnInit() {
  }

  @Input() set list(taskList: TaskList) {
    if (taskList) {
      this.taskService.getTasksForList(taskList).then(tasks => {
        this.tasks = tasks;
        this.original = tasks.slice();
      });
    }
  }

  showView(task: Task) {
    this.router.navigate(['/task/' + task.id]);
  }

  onRowReorder(dragIndex: number, dropIndex: number) {
    this.tasks.map(t => t.id);
    this.reorder.emit({
      from: this.original[dragIndex].id,
      to: dropIndex >=this.tasks.length ? undefined: this.original[dropIndex].id,
    });
  }
}

export interface RowChange {
  from: FileId;
  to: FileId | undefined;
}
