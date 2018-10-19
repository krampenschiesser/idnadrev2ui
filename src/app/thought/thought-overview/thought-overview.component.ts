import { Component, OnInit } from '@angular/core';
import { ThoughtService } from '../thought.service';
import Thought from '../../dto/Thought';

@Component({
  selector: 'app-thought-overview',
  templateUrl: './thought-overview.component.html',
  styleUrls: ['./thought-overview.component.css']
})
export class ThoughtOverviewComponent implements OnInit {
  private thoughtService: ThoughtService;
  thoughts: Thought[];

  constructor(thoughtService: ThoughtService) {
    this.thoughtService = thoughtService;
  }

  async ngOnInit() {
    await this.thoughtService.loadAllOpenThoughts();
    this.thoughtService.thoughts.subscribe(thoughts => this.thoughts = thoughts);
  }

  showPreview(thought: Thought) {
  console.log("preview ",thought)
  }
}
