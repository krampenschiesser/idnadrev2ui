import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.css']
})
export class CheckboxFilterComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() name: string;
  @Input() label: string;

  constructor() {
  }

  ngOnInit() {
  }

  toggle(newValue: boolean) {
    let state = {};
    state[this.name] = newValue;
    this.form.patchValue(state);
  }
}
