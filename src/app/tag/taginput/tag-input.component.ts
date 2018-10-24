import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Tag } from '../../dto/Tag';
import { TagService } from '../tag.service';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TagInputComponent implements OnInit {
  @Output() selectedTags = new EventEmitter<Tag[]>();
  @Input() label?: string;
  @Input() parentFormControl?: AbstractControl;
  tags: string[];
  results: string[];
  allTags: string[];
  private tagService: TagService;

  constructor(tagService: TagService) {
    this.tagService = tagService;
  }

  ngOnInit() {
    this.tagService.reload();
    this.tagService.allTags.subscribe(tags => {
      this.allTags = tags.map(t => t.name);
      this.results = this.allTags;
    });
  }

  @Input()
  set originalTags(tags: Tag[]) {
    this.tags = tags.map(t => t.name);
  }

  search(event: any) {
    const prefix = event.query;
    this.results = this.allTags.filter(tag => tag.toLocaleLowerCase().indexOf(prefix.toLocaleLowerCase()) >= 0);
    this.results.push(prefix);
  }

  onUnselect(text: string) {
    this.updateChanges();
  }

  private updateChanges() {
    let selectedTags = this.tagService.getAsTag(this.tags);
    this.selectedTags.emit(selectedTags);
    if (this.parentFormControl) {
      this.parentFormControl.patchValue(selectedTags);
    }
  }

  onSelect(text: string) {
    this.updateChanges();
  }
}
