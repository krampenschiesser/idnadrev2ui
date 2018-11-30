import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import Thought from '../../dto/Thought';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ThoughtService } from '../../service/thought.service';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { post } from 'selenium-webdriver/http';

@Component({
  selector: 'app-add-thought',
  templateUrl: './add-thought.component.html',
  styleUrls: ['./add-thought.component.css']
})
export class AddThoughtComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    tags: new FormControl([]),
    postpone: new FormControl(undefined, [postponeValidator()]),
    repository: new FormControl(undefined, [Validators.required]),
    content: new FormControl(''),
  });

  contentControl = this.form.get('content');

  thoughtInEdit = new Thought('');
  creating = false;

  constructor(private route: ActivatedRoute, private thoughtService: ThoughtService, private messageService: MessageService) {
  }

  ngOnInit() {
    this.form.patchValue(this.thoughtInEdit);
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.thoughtService.get(params.get('id')))
    ).subscribe(thought => {
      if (thought) {
        this.thoughtInEdit = thought;
        this.form.patchValue(this.thoughtInEdit);
      }
    });

    this.form.valueChanges.subscribe(value => {
      this.applyFormChanges(value);
    });
  }

  applyFormChanges(value: any) {
    let name = value.name;
    let content = value.content;
    let tags = value.tags;
    let repositoryId = value.repository;
    let postpone = value.postpone;
    if (this.thoughtInEdit && this.form.valid) {
      this.thoughtInEdit.name = name;
      this.thoughtInEdit.content = content;
      this.thoughtInEdit.tags = tags;
      this.thoughtInEdit.repository = repositoryId;
      if (postpone) {
        this.thoughtInEdit.details.showAgainAfter = moment().add(postpone, 'days').toDate();
      }
    }
  }

  onSubmit() {
    console.log("submitting")
    this.creating = true;
    if (this.form.valid) {
      this.applyFormChanges(this.form.value);
      this.thoughtService.store(this.thoughtInEdit).then(() => {
        this.creating = false;
        this.thoughtInEdit = new Thought('');
        this.form.patchValue(this.thoughtInEdit);
        this.messageService.add({severity: 'success', summary: 'Successfully created thought ' + this.thoughtInEdit.name});
      }).catch(() => {
        this.creating = false;
        this.messageService.add({severity: 'error', summary: 'Failed to create thought ' + this.thoughtInEdit.name});
      });
    }
  }
}

function postponeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let postpone = control.value;
    if (postpone && typeof postpone === 'number') {
      if (postpone < 1) {
        return {'postpone': {value: control.value}};
      }
    }
    return null;
  };
}
