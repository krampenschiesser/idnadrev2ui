import { Component, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Tag } from '../../dto/Tag';

@Component({
  selector: 'app-tag-input-form-item',
  templateUrl: './tag-input-form-item.component.html',
  styleUrls: ['./tag-input-form-item.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputFormItemComponent),
      multi: true,
    }]
})
export class TagInputFormItemComponent implements OnInit {
  tags: Tag[] = [];
  private onChange: any;
  private onTouched: any;

  constructor() {
  }

  ngOnInit() {
  }

  setTags(tags: Tag[]) {
    this.tags = tags;
    this.onChange(this.tags);
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
    if (obj) {
      this.tags = obj;
    } else {
      this.tags = [];
    }
  }
}
