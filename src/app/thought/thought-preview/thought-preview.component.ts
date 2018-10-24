import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Thought from '../../dto/Thought';

@Component({
  selector: 'app-thought-preview',
  templateUrl: './thought-preview.component.html',
  styleUrls: ['./thought-preview.component.css']
})
export class ThoughtPreviewComponent implements OnInit {
  @Input() thought: Thought;
  @Output() onDelete = new EventEmitter<void>();
  @Output() onPostpone = new EventEmitter<void>();
  @Output() onTask = new EventEmitter<void>();
  @Output() onDocument = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit() {
  }

}
