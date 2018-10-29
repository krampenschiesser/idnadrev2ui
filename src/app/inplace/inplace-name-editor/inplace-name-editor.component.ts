import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-inplace-name-editor',
  templateUrl: './inplace-name-editor.component.html',
  styleUrls: ['./inplace-name-editor.component.css']
})
export class InplaceNameEditorComponent implements OnInit {
  @Input() name: string;
  editedName: string;
  showEditor = false;
  @Output() newName = new EventEmitter<string>();

  @ViewChild('nameEdit') editField: ElementRef<HTMLInputElement>;

  constructor() {

  }

  ngOnInit() {
  }

  onShowEditor() {
    this.showEditor = true;
    this.editedName = this.name;
    setTimeout(()=>{this.editField.nativeElement.focus()},100);
  }

  saveNameChange(newName: string) {
    this.showEditor = false;
    this.newName.emit(newName);
  }
}
