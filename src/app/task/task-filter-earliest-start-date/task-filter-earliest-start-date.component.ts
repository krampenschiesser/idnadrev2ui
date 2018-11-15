import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-task-filter-earliest-start-date',
  templateUrl: './task-filter-earliest-start-date.component.html'
})
export class TaskFilterEarliestStartDateComponent implements OnInit {
  @Input() form: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
