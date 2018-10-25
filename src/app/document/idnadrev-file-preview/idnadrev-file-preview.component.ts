import {Component, Input, OnInit} from '@angular/core';
import BinaryFile from '../../dto/BinaryFile';
import Document from '../../dto/Document';
import IdnadrevFile from '../../dto/IdnadrevFile';
import Task from '../../dto/Task';
import Thought from '../../dto/Thought';

@Component({
  selector: 'app-idnadrev-file-preview',
  templateUrl: './idnadrev-file-preview.component.html',
  styleUrls: ['./idnadrev-file-preview.component.css']
})
export class IdnadrevFilePreviewComponent implements OnInit {
  thought?: Thought;
  task?: Task;
  document?: Document;
  binaryFile?: BinaryFile;

  constructor() {
  }

  @Input()
  set file(file: IdnadrevFile<any, any>) {
    this.thought = undefined;
    this.task = undefined;
    this.document = undefined;
    this.binaryFile = undefined;
    if (file instanceof Thought) {
      this.thought = file;
    } else if (file instanceof Task) {
      this.task = file;
    } else if (file instanceof BinaryFile) {
      this.binaryFile = file;
    } else if (file instanceof Document) {
      this.document = file;
    }
  }

  ngOnInit() {
  }

  onEdit() {

  }

  onDelete() {

  }
}
