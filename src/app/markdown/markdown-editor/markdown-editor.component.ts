import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.css']
})
export class MarkdownEditorComponent implements OnInit {
  content = '# hello world\nbla **BLA** _bla_\n\n* 1\n* 2\n* abc\n* def';
  @Input() parentFormControl: AbstractControl;

  constructor() {
  }

  ngOnInit() {
    if (this.parentFormControl) {
      this.content = this.parentFormControl.value;
    }
  }

  inputChanged(input: string) {
    if (this.parentFormControl) {
      this.parentFormControl.patchValue(input);
    }
  }
}
