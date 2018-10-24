import { Component, OnInit } from '@angular/core';
import { ThoughtService } from '../thought.service';
import Thought from '../../dto/Thought';
import { Router } from '@angular/router';
import { ThoughtFilter } from '../ThoughtFilter';

@Component({
  selector: 'app-thought-overview',
  templateUrl: './thought-overview.component.html',
  styleUrls: ['./thought-overview.component.css']
})
export class ThoughtOverviewComponent implements OnInit {
  private thoughtService: ThoughtService;
  thoughts: Thought[];
  allThoughts: Thought[];
  selectedThought?: Thought;
  private router: Router;
  showPostponeDialog = false;

  constructor(thoughtService: ThoughtService, router: Router) {
    this.thoughtService = thoughtService;
    this.router = router;
  }

  async ngOnInit() {
    await this.thoughtService.loadAllThoughts();
    this.thoughtService.thoughts.subscribe(thoughts => {
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
    this.thoughts = this.allThoughts.filter(t => {
        let valid = true;
        if (filter.name) {
          valid = valid && t.name.toLocaleLowerCase().includes(filter.name.toLocaleLowerCase());
        }
        if (filter.content) {
          valid = valid && t.content.toLocaleLowerCase().includes(filter.content.toLocaleLowerCase());
        }
        if (filter.tags && filter.tags.length > 0) {
          let tagsContainedInThought = t.tags.filter(tag => filter.tags.find(ft => ft.name === tag.name));
          if (tagsContainedInThought.length !== filter.tags.length) {
            valid = false;
          }
        }
        if (filter.postponed) {
          valid = valid && t.isPostPoned;
        } else {
          valid = valid && !t.isPostPoned;
        }
        return valid;
      }
    );
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
