import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import Document from '../../dto/Document';

@Component({
  selector: 'app-document-preview',
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.css']
})
export class DocumentPreviewComponent implements OnInit {
  @Input() doc: Document;
  @Output() onDelete = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit() {
  }

}
