import {Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-reset-field-button',
  templateUrl: './reset-field-button.component.html',
  styleUrls: ['./reset-field-button.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ResetFieldButtonComponent),
      multi: true,
    }]
})
export class ResetFieldButtonComponent implements OnInit, ControlValueAccessor {
  private onChange: any;

  constructor() {
  }

  ngOnInit() {
  }

  onClick() {
    this.onChange(undefined);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
  }

}
