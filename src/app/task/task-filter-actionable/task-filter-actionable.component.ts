import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-task-filter-actionable',
  templateUrl: './task-filter-actionable.component.html'
})
export class TaskFilterActionableComponent implements OnInit {
  @Input() form: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
