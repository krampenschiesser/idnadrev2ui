import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MarkdownEditorComponent } from '../../markdown/markdown-editor/markdown-editor.component';

@Component({
  selector: 'app-inplace-content-editor',
  templateUrl: './inplace-content-editor.component.html',
  styleUrls: ['./inplace-content-editor.component.css']
})
export class InplaceContentEditorComponent implements OnInit {
  @Input() text: string;
  editedText: string;
  textToEdit: string;
  showEditor = false;
  @Output() newText = new EventEmitter<string>();

  @ViewChild('editor') editor: MarkdownEditorComponent;

  constructor() {

  }

  ngOnInit() {
    console.log("text", this.text)
  }

  onShowEditor() {
    this.showEditor = true;
    this.textToEdit = this.text;
    this.editedText = this.text;
    setTimeout(()=>{this.editor.foucs()},100);
  }

  saveTextChange() {
    this.showEditor = false;
    this.newText.emit(this.editedText);
  }

  onCodeMirrorChange(text: string) {
    this.editedText=text;
  }
}
