import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import * as CodeMirror from 'codemirror';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Template from '../../dto/Template';

@Component({
  selector: 'app-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.css']
})
export class MarkdownEditorComponent implements OnInit {
  @Input() parentFormControl: AbstractControl;
  @Input() text?: string;
  current = '';
  @ViewChild('textArea') textArea: ElementRef;
  @Output() onTextChange = new EventEmitter<string>();

  codeMirror: CodeMirror.EditorFromTextArea;
  changes = new Subject<string>();
  showTemplateSelection = false;

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
      this.parentFormControl.valueChanges.subscribe(value => {
        let str: string = value;
        if (value !== this.current) {
          this.codeMirror.setValue(str);
        }
      });
    } else if (this.text) {
      this.current = this.text;
      this.codeMirror.setValue(this.current);
    }

    this.changes.pipe(
      debounceTime(10),
      distinctUntilChanged()).subscribe(value => {
      this.current = value;
      if (this.parentFormControl) {
        this.parentFormControl.patchValue(value);
      } else {
        this.onTextChange.emit(value);
      }
    });
  }

  foucs() {
    this.codeMirror.focus();
  }

  selectTemplate(template: Template) {
    this.appendText(template.content);
    this.showTemplateSelection=false;
  }

  private moveCursor(relativePosition: number){
    let doc = this.codeMirror.getDoc();
    let cursor = Object.assign({},doc.getCursor());
    let character = cursor.ch + relativePosition;
    if(character<0){
      character=0;
    }
    cursor.ch=character;
    this.codeMirror.focus();
    this.codeMirror.setCursor(cursor)
  }

  private appendText(content: string) {
    let doc = this.codeMirror.getDoc();
    let cursor = doc.getCursor();
    doc.replaceRange(content, cursor);

    this.codeMirror.focus();
    let lastLine = doc.lastLine();
    let line = doc.getLine(lastLine);
    let ch = line.length;
    this.codeMirror.setCursor({line:lastLine,ch: ch});
  }
}