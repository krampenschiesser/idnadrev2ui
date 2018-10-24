import { Component, OnInit } from '@angular/core';
import { ThoughtService } from '../thought.service';
import Thought from '../../dto/Thought';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-thought-overview',
  templateUrl: './thought-overview.component.html',
  styleUrls: ['./thought-overview.component.css']
})
export class ThoughtOverviewComponent implements OnInit {
  private thoughtService: ThoughtService;
  thoughts: Thought[];
  selectedThought?: Thought;
  private router: Router;
  showPostponeDialog = false;

  constructor(thoughtService: ThoughtService, router: Router) {
    this.thoughtService = thoughtService;
    this.router = router;
  }

  async ngOnInit() {
    await this.thoughtService.loadAllOpenThoughts();
    this.thoughtService.thoughts.subscribe(thoughts => {
      this.thoughts = thoughts;
      if (!this.selectedThought && this.thoughts.length > 0) {
        this.selectedThought = this.thoughts[0];
      } else if (this.thoughts.length == 0) {
        this.selectedThought = undefined;
      }
    });
  }

  showPreview(thought: Thought) {
    this.selectedThought = thought;
  }

  addThought() {
    this.router.navigate(['/thought/add']);
  }

  async postpone(days: number) {
    await this.thoughtService.postpone(this.selectedThought, days).catch(e => {
      this.showPostponeDialog = false;
      throw e;
    });
    this.showPostponeDialog = false;
  }

  delete() {
    this.thoughtService.delete(this.selectedThought);

  }

  edit() {
    this.router.navigate(['/thought/'+this.selectedThought.id]);
  }

  thoughtToDoc() {
    this.router.navigate(['/doc/fromThought', {fromThoughtId: this.selectedThought.id}]);
  }

  thoughtToTask() {
    this.router.navigate(['/task/fromThought', {fromThoughtId: this.selectedThought.id}]);
  }
}
