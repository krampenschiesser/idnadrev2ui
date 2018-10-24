import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import * as CodeMirror from 'codemirror';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.css']
})
export class MarkdownEditorComponent implements OnInit {
  @Input() parentFormControl: AbstractControl;
  current = '';
  @ViewChild('textArea') textArea: ElementRef;

  codeMirror: CodeMirror.EditorFromTextArea;
  changes = new Subject<string>();

  constructor() {
  }

  ngOnInit() {
    this.codeMirror = CodeMirror.fromTextArea(this.textArea.nativeElement, {
      lineNumbers: true,
      theme: 'monokai',
      mode: 'markdown'
    });
    this.codeMirror.on('changes', () => {
      this.changes.next(this.codeMirror.getValue());
    });

    if (this.parentFormControl) {
      this.current = this.parentFormControl.value;
      this.codeMirror.setValue(this.current);
    }
    this.parentFormControl.valueChanges.subscribe(value => {
      let str: string = value;
      if (value !== this.current) {
        this.codeMirror.setValue(str);
      }
    });

    this.changes.pipe(
      debounceTime(10),
      distinctUntilChanged()).subscribe(value => {
        this.current = value;
        if (this.parentFormControl) {
          this.parentFormControl.patchValue(value);
        }
    });
  }
}