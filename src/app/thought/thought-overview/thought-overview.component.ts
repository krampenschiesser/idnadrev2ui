import { Component, OnInit } from '@angular/core';
import { ThoughtService } from '../../service/thought.service';
import Thought from '../../dto/Thought';
import { Router } from '@angular/router';
import { ThoughtFilter } from '../ThoughtFilter';
import { filterFiles } from '../../filter/IdnadrevFileFilter';

@Component({
  selector: 'app-thought-overview',
  templateUrl: './thought-overview.component.html',
  styleUrls: ['./thought-overview.component.css']
})
export class ThoughtOverviewComponent implements OnInit {
  thoughts: Thought[];
  allThoughts: Thought[];
  selectedThought?: Thought;
  showPostponeDialog = false;

  constructor(private thoughtService: ThoughtService, private router: Router) {
  }

  async ngOnInit() {
    await this.thoughtService.loadAll();
    this.thoughtService.files.subscribe(thoughts => {
      this.allThoughts = thoughts;
      this.thoughts = thoughts.filter(t => !t.isPostPoned);
      if (!this.selectedThought && this.thoughts.length > 0) {
        this.selectedThought = this.thoughts[0];
      } else if (this.thoughts.length == 0) {
        this.selectedThought = undefined;
      }
    });
  }

  onFilter(filter: ThoughtFilter) {
    this.thoughts = filterFiles(this.allThoughts,filter,t=>{
      if (filter.postponed) {
        return t.isPostPoned;
      } else {
        return !t.isPostPoned;
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
    this.router.navigate(['/thought/' + this.selectedThought.id]);
  }

  thoughtToDoc() {
    this.router.navigate(['/doc/fromThought', {fromThoughtId: this.selectedThought.id}]);
  }

  thoughtToTask() {
    this.router.navigate(['/task/fromThought', {fromThoughtId: this.selectedThought.id}]);
  }
}
