import { Component, Input, OnInit } from '@angular/core';
import { Tag } from '../../dto/Tag';

@Component({
  selector: 'app-tagview',
  templateUrl: './tagview.component.html',
  styleUrls: ['./tagview.component.css']
})
export class TagviewComponent implements OnInit {
  @Input() tags: Tag[];

  constructor() {
  }

  ngOnInit() {
  }

}
