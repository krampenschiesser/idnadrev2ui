import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import TaskFilter from './TaskFilter';
import { TaskService } from '../../service/task.service';
import { DisplayService } from '../../service/display.service';

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.css']
})
export class TaskFilterComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl(),
    content: new FormControl(),
    tags: new FormControl(),
    finished: new FormControl(false),
    state: new FormControl(),
    project: new FormControl(),
    actionable: new FormControl(),
    earliestStartDate: new FormControl(),
    remainingTime: new FormControl(),
  });
  @Output() filter = new EventEmitter<TaskFilter>();

  constructor(private taskService: TaskService,public display:DisplayService) {
  }

  ngOnInit() {
    this.form.valueChanges.pipe(
      debounceTime(10),
      distinctUntilChanged()).subscribe(newFormValue => {
      if (newFormValue.type) {
        newFormValue.type = newFormValue.type.value;
      }
      console.log(newFormValue)
      this.filter.emit(newFormValue);
    });
  }

  onReset() {
    this.form.reset();
  }


  get tagStyleClass() : string {
    return this.display.xsOnly ? "FormInputTagSmall" : null;
  }
}
