import { Component, OnInit } from '@angular/core';
import Contact from '../../dto/Contact';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ContactService } from '../../service/contact.service';
import { switchMap } from 'rxjs/operators';
import Thought from '../../dto/Thought';
import { ThoughtService } from '../../service/thought.service';

@Component({
  selector: 'app-thought-view',
  templateUrl: './thought-view.component.html',
  styleUrls: ['./thought-view.component.css']
})
export class ThoughtViewComponent implements OnInit {
  thoughtToShow?: Thought;

  constructor(private route: ActivatedRoute, private thoughtService: ThoughtService, private router: Router) {
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
  }

  onEdit() {
    if (this.thoughtToShow) {
      this.router.navigate(['/thought/edit/' + this.thoughtToShow.id]);
    }
  }

  onDelete() {
    if (this.thoughtToShow) {
      this.thoughtService.delete(this.thoughtToShow);
      this.router.navigate(['/thought']);
    }
  }

}
