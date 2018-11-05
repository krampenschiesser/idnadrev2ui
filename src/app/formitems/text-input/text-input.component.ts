import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    }]
})
export class TextInputComponent implements OnInit, ControlValueAccessor {
  @Input() label: string;
  @Input() validationError?: string;
  @Input() invalid?: boolean;
  @Input() number?: boolean;

  _input: string;
  private onChange: any;
  private onTouched: any;

  constructor() {
  }

  set input(input: string) {
    this._input = input;
    if (this.number) {
      let number = parseInt(input);
      this.onChange(number);
    } else {
      this.onChange(input);
    }
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
