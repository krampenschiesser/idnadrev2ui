import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ThoughtFilter } from '../ThoughtFilter';

@Component({
  selector: 'app-thought-filter',
  templateUrl: './thought-filter.component.html',
  styleUrls: ['./thought-filter.component.css']
})
export class ThoughtFilterComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl(),
    content: new FormControl(),
    tags: new FormControl(),
  });
  @Output() filter = new EventEmitter<ThoughtFilter>();

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
