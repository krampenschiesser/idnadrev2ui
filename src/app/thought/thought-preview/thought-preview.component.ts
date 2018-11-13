import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Thought from '../../dto/Thought';

@Component({
  selector: 'app-thought-preview',
  templateUrl: './thought-preview.component.html',
  styleUrls: ['./thought-preview.component.css']
})
export class ThoughtPreviewComponent implements OnInit {
  @Input() thought: Thought;

  constructor() {
  }

  ngOnInit() {
  }

  noop(){

  }
}
