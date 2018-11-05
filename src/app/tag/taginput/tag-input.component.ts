import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Tag } from '../../dto/Tag';
import { TagService } from '../tag.service';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputComponent),
      multi: true,
    }]
})
export class TagInputComponent implements OnInit, ControlValueAccessor {
  @Output() selectedTags = new EventEmitter<Tag[]>();
  @Input() label?: string;
  tags: Tag[];
  results: Tag[];
  allTags: Tag[];
  private tagService: TagService;
  private onChange: any;
  private onTouched: any;

  constructor(tagService: TagService) {
    this.tagService = tagService;
  }

  ngOnInit() {
    this.tagService.reload();
    this.tagService.allTags.subscribe(tags => {
      this.allTags = tags;
      this.results = this.allTags;
    });
  }


  @Input()
  set originalTags(tags: Tag[] | undefined) {
    if (tags) {
      this.tags = tags;
    }
  }

  search(event: any) {
    const prefix = event.query;
    if (prefix === '' || prefix.trim() === '') {
      this.results = this.allTags.slice();
    } else {
      this.results = this.allTags.filter(tag => tag.name.toLocaleLowerCase().indexOf(prefix.toLocaleLowerCase()) >= 0);
      this.results.push(prefix);
    }
  }

  onUnselect(text: string) {
    this.updateChanges();
  }

  private updateChanges() {
    this.onChange(this.tags);
    if (this.selectedTags.emit) {
      this.selectedTags.emit(this.tags);
    }
  }

  onSelect(text: any) {
    this.updateChanges();
  }

  onKeyUp(event: any) {
    if (event.key && event.key === 'Escape') {
      this.reset();
    }
  }

  reset() {
    this.tags = [];
    if (this.selectedTags.emit) {
      this.selectedTags.emit([]);
    }
    this.onChange([]);
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
    this.selectedTags = obj;
  }
}
