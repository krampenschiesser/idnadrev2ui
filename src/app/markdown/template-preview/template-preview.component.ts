import { Component, Input, OnInit } from '@angular/core';
import Template from '../../dto/Template';

@Component({
  selector: 'app-template-preview',
  templateUrl: './template-preview.component.html',
  styleUrls: ['./template-preview.component.css']
})
export class TemplatePreviewComponent implements OnInit {
  @Input() template: Template;

  constructor() { }

  ngOnInit() {
  }

}
