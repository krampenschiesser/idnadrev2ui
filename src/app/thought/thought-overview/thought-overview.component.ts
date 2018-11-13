import { Component, OnInit } from '@angular/core';
import { ThoughtService } from '../../service/thought.service';
import Thought from '../../dto/Thought';
import { Router } from '@angular/router';
import { ThoughtFilter } from '../ThoughtFilter';
import { filterFiles } from '../../filter/IdnadrevFileFilter';
import { DisplayService } from '../../service/display.service';

@Component({
  selector: 'app-thought-overview',
  templateUrl: './thought-overview.component.html',
  styleUrls: ['./thought-overview.component.css']
})
export class ThoughtOverviewComponent implements OnInit {
  thoughts: Thought[];
  allThoughts: Thought[];
  selectedThought?: Thought;

  constructor(private thoughtService: ThoughtService, private router: Router, public display: DisplayService) {
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
    this.thoughts = filterFiles(this.allThoughts, filter, t => {
      if (filter.postponed) {
        return t.isPostPoned;
      } else {
        return !t.isPostPoned;
      }
    });
  }

  showView(thought: Thought) {
    this.router.navigate(['/thought/' + this.selectedThought.id]);
  }

  showPreview(thought: Thought) {
    this.selectedThought = thought;
  }

  addThought() {
    this.router.navigate(['/thought/add']);
  }

  noop() {

  }
}
