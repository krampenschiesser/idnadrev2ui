import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DisplayService } from '../../service/display.service';

@Component({
  selector: 'app-markdown-buttons',
  templateUrl: './markdown-buttons.component.html',
  styleUrls: ['./markdown-buttons.component.css']
})
export class MarkdownButtonsComponent implements OnInit {
  @Output() bold = new EventEmitter<void>();
  @Output() italic = new EventEmitter<void>();
  @Output() olist = new EventEmitter<void>();
  @Output() ulist = new EventEmitter<void>();
  @Output() heading = new EventEmitter<void>();
  @Output() quote = new EventEmitter<void>();
  @Output() code = new EventEmitter<void>();
  @Output() link = new EventEmitter<void>();
  @Output() template = new EventEmitter<void>();
  @Output() hruler = new EventEmitter<void>();

  barStyle = {};

  constructor() {
  }

  ngOnInit() {
  }

  @Input() set fixed(val: boolean) {
    console.log("buttonbar",val);
    if (val) {
      this.barStyle = {
        'position': 'fixed',
        'top': '0px',
        'z-index': 1000
      };
    } else {
      this.barStyle = {};
    }
    console.log("buttonbar style",this.barStyle);
  }
}
