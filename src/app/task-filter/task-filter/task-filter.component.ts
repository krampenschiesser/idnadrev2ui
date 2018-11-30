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
  taskStates = ['Asap', 'Later'];

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

  searchStates(event: any) {
    const prefix: string = event.query;
    let possibleValues = this.taskService.states;
    let lowerCaseValues = possibleValues.map(v => v.toLocaleLowerCase());
    if (!lowerCaseValues.includes('asap')) {
      possibleValues.push('Asap');
    }
    if (!lowerCaseValues.includes('later')) {
      possibleValues.push('Later');
    }
    if (!lowerCaseValues.includes('none')) {
      possibleValues.push('None');
    }
    let result = [];
    possibleValues.filter(s => s.toLocaleLowerCase().includes(prefix.toLocaleLowerCase())).forEach(s => result.push(s));
    this.taskStates = result;
  }

  get tagStyleClass() : string {
    return this.display.xsOnly ? "FormInputTagSmall" : null;
  }
}
