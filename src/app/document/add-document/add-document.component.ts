import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Thought from '../../dto/Thought';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ThoughtService } from '../../thought/thought.service';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import Document from "../../dto/Document";
import { DocumentService } from '../document.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css']
})
export class AddDocumentComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    tags: new FormControl([]),
    repository: new FormControl(undefined, [Validators.required]),
    content: new FormControl(''),
  });

  tagsControl = this.form.get('tags');
  contentControl = this.form.get('content');

  docInEdit = new Document('');
  creating = false;

  constructor(private route: ActivatedRoute, private docService: DocumentService, private messageService: MessageService) {
  }

  ngOnInit() {
    this.form.patchValue(this.docInEdit);
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.docService.getDoc(params.get('id')))
    ).subscribe(doc => {
      if (doc) {
        this.docInEdit = doc;
        this.form.patchValue(this.docInEdit);
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
    if (this.docInEdit && this.form.valid) {
      this.docInEdit.text = name;
      this.docInEdit.content = content;
      this.docInEdit.tags = tags;
      this.docInEdit.repository = repositoryId;
    }
  }

  onSubmit() {
    this.creating = true;
    if (this.form.valid) {
      this.applyFormChanges(this.form.value);
      this.docService.store(this.docInEdit).then(() => {
        this.creating = false;
        this.messageService.add({severity: 'success', summary: 'Successfully created document ' + this.docInEdit.name});
        this.docInEdit = new Document('');
        this.form.patchValue(this.docInEdit)
      }).catch(() => {
        this.creating = false;
        this.messageService.add({severity: 'error', summary: 'Failed to create document ' + this.docInEdit.name});
      });
    }
  }
}
