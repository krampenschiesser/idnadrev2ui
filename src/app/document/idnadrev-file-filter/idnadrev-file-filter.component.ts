import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  types=[FileType.Task,FileType.Document,FileType.Thought,FileType.Binary];

  constructor() {
  }

  ngOnInit() {
    this.form.valueChanges.pipe(
      debounceTime(10),
      distinctUntilChanged()).subscribe(newFormValue => {
      this.filter.emit(newFormValue);
    });
  }

  onReset(){
    this.form.reset();
  }

}
