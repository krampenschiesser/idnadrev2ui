import { Component, Input, OnInit } from '@angular/core';
import IdnadrevFile from '../../dto/IdnadrevFile';
import Thought from '../../dto/Thought';
import Task from '../../dto/Task';
import Document from '../../dto/Document';
import BinaryFile from '../../dto/BinaryFile';

@Component({
  selector: 'app-idnadrev-file-preview',
  templateUrl: './idnadrev-file-preview.component.html',
  styleUrls: ['./idnadrev-file-preview.component.css']
})
export class IdnadrevFilePreviewComponent implements OnInit {
  @Input() file: IdnadrevFile<any, any>;

  thought?: Thought;
  task?: Task;
  document?: Document;
  binaryFile?: BinaryFile;

  constructor() {
  }

  ngOnInit() {
  }
}
