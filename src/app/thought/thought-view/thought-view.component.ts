import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import Thought from '../../dto/Thought';
import { ThoughtService } from '../../service/thought.service';
import { DisplayService } from '../../service/display.service';

@Component({
  selector: 'app-thought-view',
  templateUrl: './thought-view.component.html',
  styleUrls: ['./thought-view.component.css']
})
export class ThoughtViewComponent implements OnInit {
  thoughtToShow?: Thought;
  showLabels = false;

  constructor(private route: ActivatedRoute, private thoughtService: ThoughtService, private router: Router, public display: DisplayService) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.thoughtService.get(params.get('id')))
    ).subscribe(task => {
      if (task) {
        this.thoughtToShow = task;
      }
    });
    this.display.lgObservable.subscribe(large => {
      if (large) {
        this.showLabels = true;
      } else {
        this.showLabels = false;
      }
    });
  }


}
