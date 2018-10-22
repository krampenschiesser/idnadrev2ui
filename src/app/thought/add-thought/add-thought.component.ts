import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Tag } from '../../dto/Tag';

@Component({
  selector: 'app-add-thought',
  templateUrl: './add-thought.component.html',
  styleUrls: ['./add-thought.component.css']
})
export class AddThoughtComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl(''),
    tags: new FormControl([]),
    postpone: new FormControl(0),
    content: new FormControl(''),
  });

  initialTags = [new Tag('Test')];
  tagsControl = this.form.get('tags');

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.form);
  }

  setTags(tags: Tag[]) {

  }
}
