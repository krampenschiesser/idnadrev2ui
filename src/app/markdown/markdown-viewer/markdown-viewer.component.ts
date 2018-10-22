import { Component, Input, OnInit } from '@angular/core';
import { MarkdownService } from '../markdown.service';

@Component({
  selector: 'app-markdown-viewer',
  templateUrl: './markdown-viewer.component.html',
  styleUrls: ['./markdown-viewer.component.css']
})
export class MarkdownViewerComponent implements OnInit {

  _markdown: string;
  private service;

  constructor(service: MarkdownService) {
    this.service = service;
  }

  ngOnInit() {
  }

  @Input()
  set markdown(markdown: string) {
    this._markdown = this.service.render(markdown);
  }

}
