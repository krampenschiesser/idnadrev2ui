import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-content-filter',
  templateUrl: './content-filter.component.html',
  styleUrls: ['./content-filter.component.css']
})
export class ContentFilterComponent implements OnInit {
  @Input() form: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
