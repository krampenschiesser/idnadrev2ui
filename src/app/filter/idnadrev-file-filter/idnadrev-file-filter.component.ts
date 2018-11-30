import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ThoughtFilter } from '../../thought/ThoughtFilter';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import IdnadrevFileFilter from '../../filter/IdnadrevFileFilter';
import { FileType } from '../../dto/FileType';

@Component({
  selector: 'app-idnadrev-file-filter',
  templateUrl: './idnadrev-file-filter.component.html',
  styleUrls: ['./idnadrev-file-filter.component.css']
})
export class IdnadrevFileFilterComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl(),
    content: new FormControl(),
    tags: new FormControl(),
    type: new FormControl(),
  });
  @Output() filter = new EventEmitter<IdnadrevFileFilter>();
  types = [{label: 'Task', value: FileType.Task}, {label: 'Document', value: FileType.Document}, {label: 'Thought', value: FileType.Thought}, {label: 'Binary', value: FileType.Binary}];
  @Input() typeFilter = true;

  constructor() {
  }

  ngOnInit() {
    this.form.valueChanges.pipe(
      debounceTime(10),
      distinctUntilChanged()).subscribe(newFormValue => {
      if (newFormValue.type) {
        newFormValue.type = newFormValue.type.value;
      }
      this.filter.emit(newFormValue);
    });
  }

  onReset() {
    this.form.reset();
  }

}
