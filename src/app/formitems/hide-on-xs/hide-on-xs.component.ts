import { Component, ContentChild, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { DisplayService } from '../../service/display.service';

@Component({
  selector: 'app-hide-on-xs',
  templateUrl: './hide-on-xs.component.html',
  styleUrls: ['./hide-on-xs.component.css']
})
export class HideOnXSComponent implements OnInit {
  @ContentChild(TemplateRef) template: TemplateRef<ElementRef>;

  constructor(public display: DisplayService) { }

  ngOnInit() {
  }

}
