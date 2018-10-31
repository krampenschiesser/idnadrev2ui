import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import Document from '../../dto/Document';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DocumentService } from '../../document/document.service';
import { MessageService } from 'primeng/api';
import { switchMap } from 'rxjs/operators';
import Task, { FixedScheduling, ProposedDateTime, ProposedWeekDayYear } from '../../dto/Task';
import { TaskService } from '../task.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    tags: new FormControl([]),
    repository: new FormControl(undefined, [Validators.required]),
    content: new FormControl(''),
    details: new FormGroup({
      estimatedTime: new FormControl(),
      state: new FormControl(),
      action: new FormControl(false),
      finished: new FormControl(),
      workUnits: new FormControl(),
      earliestStartDate: new FormControl(),
      delegation: new FormGroup({
        history: new FormControl([]),
        current: new FormControl(),
      }),
      schedule: new FormGroup({
        fixedScheduling: new FormGroup({
          scheduledDateTime: new FormControl(),
          scheduledDateOnly: new FormControl(false),
        }),
        proposedWeekDayYear: new FormGroup({
          proposedYear: new FormControl(moment().year()),
          proposedWeek: new FormControl(moment().isoWeek()),
          proposedWeekDay: new FormControl(),
        }),
        proposedDate: new FormGroup({
          proposedDateTime: new FormControl(),
          proposedDateOnly: new FormControl(true),
        }),
      }),
    }),
  });

  taskInEdit = new Task('');
  creating = false;
  taskStates = ['Asap', 'Later'];

  constructor(private route: ActivatedRoute, private taskService: TaskService, private messageService: MessageService) {
  }

  async ngOnInit() {
    await this.taskService.loadAllTaskStates();
    this.form.patchValue(this.taskInEdit);
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.taskService.getTask(params.get('id')))
    ).subscribe(task => {
      if (task) {
        this.taskInEdit = task;
        this.form.patchValue(this.taskInEdit);
      }
    });

    this.form.valueChanges.subscribe(value => {
      console.log('form change ', value);
      this.applyFormChanges(value);
    });
  }

  applyFormChanges(value: any) {

    if (value.details.estimatedTime&& !value.details.action) {
      value.details.action = true;
      console.log('patching')
      this.form.patchValue({details: {action: true}});
    }
    // let name = value.name;
    // let content = value.content;
    // let tags = value.tags;
    // let repositoryId = value.repository;
    // let finished = value.finished;
    // let estimatedTime = value.estimatedTime;
    // let state = value.state;
    // let action = value.action;
    // let currentDelegation: string = value.currentDelegation;
    // let earliestStartDate = value.earliestStartDate;
    // let parent = value.parent;
    // let fixedScheduling = value.fixedScheduling;
    // let proposedWeekDayYear = value.proposedWeekDayYear;
    // let proposedDate = value.proposedDate;
    //
    // if (this.taskInEdit && this.form.valid) {
    //   this.taskInEdit.name = name;
    //   this.taskInEdit.content = content;
    //   this.taskInEdit.tags = tags;
    //   this.taskInEdit.repository = repositoryId;
    //   this.taskInEdit.details.state = state;
    //   this.taskInEdit.details.estimatedTime = estimatedTime;
    //   this.taskInEdit.details.finished = finished;
    //   this.taskInEdit.details.action = action;
    //   if (currentDelegation && currentDelegation.length > 0) {
    //     this.taskInEdit.details.delegation.current = currentDelegation;
    //   }
    //   this.taskInEdit.details.earliestStartDate = earliestStartDate;
    // }
    if (this.taskInEdit && this.form.valid) {
      Object.assign(this.taskInEdit, value);
      console.log(this.taskInEdit);
    }
  }

  onSubmit() {
    this.creating = true;
    if (this.form.valid) {
      this.applyFormChanges(this.form.value);
      this.taskService.store(this.taskInEdit).then(() => {
        this.creating = false;
        this.messageService.add({severity: 'success', summary: 'Successfully created document ' + this.taskInEdit.name});
        this.taskInEdit = new Task('');
        this.form.patchValue(this.taskInEdit);
      }).catch(() => {
        this.creating = false;
        this.messageService.add({severity: 'error', summary: 'Failed to create document ' + this.taskInEdit.name});
      });
    }
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
    let result = possibleValues.filter(s => s.toLocaleLowerCase().includes(prefix.toLocaleLowerCase()));
    this.taskStates = result;
  }
}

function earliestStartDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let date = control.value;
    if (date) {
      if (moment().isAfter(moment(date))) {
        return {'earliestStartDate': {value: control.value}};
      }
    }
    return null;
  };
}