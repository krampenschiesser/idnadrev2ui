import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-contact-array-input',
  templateUrl: './contact-array-input.component.html',
  styleUrls: ['./contact-array-input.component.css']
})
export class ContactArrayInputComponent implements OnInit {
  @Input() array: FormArray;
  @Input() label: string;
  @Input() arrayName: string;
  @Input() groupName?: string;
  @Input() root: string;

  constructor() {
  }

  ngOnInit() {
  }

  onAdd() {
    this.array.push(new FormControl());
  }
}
