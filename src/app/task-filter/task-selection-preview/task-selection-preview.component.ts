import { Component, Input, OnInit } from '@angular/core';
import Task from '../../dto/Task';

@Component({
  selector: 'app-task-selection-preview',
  templateUrl: './task-selection-preview.component.html',
  styleUrls: ['./task-selection-preview.component.css']
})
export class TaskSelectionPreviewComponent implements OnInit {
  @Input() task: Task;

  constructor() { }

  ngOnInit() {
  }

}
