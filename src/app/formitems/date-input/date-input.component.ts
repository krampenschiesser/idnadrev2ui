import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true,
    }]
})
export class DateInputComponent implements OnInit, ControlValueAccessor {
  @Input() label: string;
  @Input() validationError?: string;
  @Input() invalid?: boolean;
  @Input() showTime: boolean = false;

  _input: Date;
  private onChange: any;
  private onTouched: any;

  constructor() {
  }

  set input(input: Date) {
    this._input = input;
    this.onChange(input);
  }

  get input() {
    return this._input;
  }

  ngOnInit() {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
    this._input = obj;
  }

}
