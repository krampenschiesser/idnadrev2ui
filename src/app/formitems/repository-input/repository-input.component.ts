import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { RepositoryId } from '../../dto/RepositoryId';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-repository-input',
  templateUrl: './repository-input.component.html',
  styleUrls: ['./repository-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RepositoryInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RepositoryInputComponent),
      multi: true,
    }
  ],
})
export class RepositoryInputComponent implements OnInit {
  repository: RepositoryId;
  private onChange: any;
  private onTouched: any;

  constructor() {
  }

  setRepository(repositoryId: RepositoryId) {
    this.repository = repositoryId;
    this.onChange(repositoryId);
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
    this.repository = obj;
  }


  public validate(c: FormControl) {
    if (this.repository === undefined) {
      return {'repository': {valid: false}};
    } else {
      return null;
    }
  }
}
