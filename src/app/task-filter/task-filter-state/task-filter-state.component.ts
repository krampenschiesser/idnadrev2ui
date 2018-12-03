import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TaskService } from '../../service/task.service';

@Component({
  selector: 'app-task-filter-state',
  templateUrl: './task-filter-state.component.html'
})
export class TaskFilterStateComponent implements OnInit {
  @Input() form: FormGroup;
  taskStates = ['Asap', 'Later'];

  constructor(private taskService: TaskService) { }

  ngOnInit() {
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

  onSelect(state: string) {
    this.form.patchValue({
      state: state
    })
  }
}
