import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import IdnadrevFileFilter from '../../filter/IdnadrevFileFilter';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  });
  @Output() filter = new EventEmitter<IdnadrevFileFilter>();

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
