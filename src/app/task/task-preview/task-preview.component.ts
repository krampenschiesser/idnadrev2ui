import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import Task from '../../dto/Task';

@Component({
  selector: 'app-task-preview',
  templateUrl: './task-preview.component.html',
  styleUrls: ['./task-preview.component.css']
})
export class TaskPreviewComponent implements OnInit {

  @Input() task: Task;
  @Output() onDelete = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit() {
  }

}
