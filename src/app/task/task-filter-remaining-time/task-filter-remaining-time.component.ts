import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-task-filter-remaining-time',
  templateUrl: './task-filter-remaining-time.component.html'
})
export class TaskFilterRemainingTimeComponent implements OnInit {
  @Input() form: FormGroup;

  constructor() {
  }

  ngOnInit() {
  }

}
