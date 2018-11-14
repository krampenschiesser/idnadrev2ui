import { Component, Input, OnInit } from '@angular/core';
import Task from '../../dto/Task';
import { DisplayService } from '../../service/display.service';
import { TaskService } from '../../service/task.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-task-buttons',
  templateUrl: './task-buttons.component.html',
  styleUrls: ['./task-buttons.component.css']
})
export class TaskButtonsComponent implements OnInit {
  @Input() task: Task;
  @Input() showLabels: boolean = false;
  @Input('onDelete') onDeleteCallback: () => void;
  showListSelection=false;

  constructor(public display: DisplayService, private taskService: TaskService, private location: Location) {
  }

  ngOnInit() {
  }

  onStartWork() {

  }

  onEdit() {

  }

  onAddToList() {

  }

  onFinish() {
    this.taskService.finishTask(this.task);
    this.location.back();
  }

  onDelete() {
    this.taskService.delete(this.task);
    if (this.onDeleteCallback) {
      this.onDeleteCallback();
    } else {
      this.location.back();
    }
  }
}
