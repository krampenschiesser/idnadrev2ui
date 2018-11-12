import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import IdnadrevFileFilter from '../../filter/IdnadrevFileFilter';
import { FileType } from '../../dto/FileType';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import ContactFilter from './ContactFilter';

@Component({
  selector: 'app-contact-filter',
  templateUrl: './contact-filter.component.html',
  styleUrls: ['./contact-filter.component.css']
})
export class ContactFilterComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl(),
    anyField: new FormControl(),
    tags: new FormControl(),
  });
  @Output() filter = new EventEmitter<ContactFilter>();

  constructor() {
  }

  ngOnInit() {
    this.form.valueChanges.pipe(
      debounceTime(10),
      distinctUntilChanged()).subscribe(newFormValue => {
      this.filter.emit(newFormValue);
    });
  }

  onReset() {
    this.form.reset();
  }


}
