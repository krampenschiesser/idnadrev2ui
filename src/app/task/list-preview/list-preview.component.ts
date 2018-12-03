import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import TaskList from '../../dto/TaskList';
import { DisplayService } from '../../service/display.service';
import Task from '../../dto/Task';
import { TaskService } from '../../service/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-preview',
  templateUrl: './list-preview.component.html',
  styleUrls: ['./list-preview.component.css']
})
export class ListPreviewComponent implements OnInit {
  @Input() tasks?: Task[];
  @Input() manualSorting = false;
  @Output() reorder = new EventEmitter<RowChange>();

  constructor(public display: DisplayService, private taskService: TaskService, private router: Router) {
  }

  async ngOnInit() {
  }

  @Input() set list(taskList: TaskList) {
    if (taskList) {
      this.taskService.getTasksForList(taskList).then(tasks => {
        this.tasks = tasks;
      });
    }
  }

  showView(task: Task) {
    this.router.navigate(['/task/' + task.id]);
  }

  onRowReorder(dragIndex: number, dropIndex: number) {
    console.log('from',dragIndex)
    console.log('to',dropIndex)
    this.reorder.emit({
      from: this.tasks[dragIndex],
      to: this.tasks[dropIndex],
    })
  }
}

export interface RowChange{
  from: Task;
  to: Task;
}