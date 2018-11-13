import { Component, Input, OnInit } from '@angular/core';
import Thought from '../../dto/Thought';
import { Router } from '@angular/router';
import { ThoughtService } from '../../service/thought.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-thought-buttons',
  templateUrl: './thought-buttons.component.html',
  styleUrls: ['./thought-buttons.component.css']
})
export class ThoughtButtonsComponent implements OnInit {
  @Input() thought: Thought;
  @Input() showLabels: boolean = false;
  @Input() callback?: () => void;

  showPostponeDialog = false;

  constructor(private router: Router, private thoughtService: ThoughtService, private  location: Location) {
  }

  ngOnInit() {

  }

  onEdit() {
    this.router.navigate(['/thought/edit/' + this.thought.id]);
  }

  onDelete() {
    this.thoughtService.delete(this.thought);
    if (this.callback) {
      this.callback();
    } else {
      this.location.back();
    }
  }

  onDocument() {
    this.router.navigate(['/doc/fromThought', {fromThoughtId: this.thought.id}]);
  }

  onTask() {
    this.router.navigate(['/task/fromThought', {fromThoughtId: this.thought.id}]);
  }

  async postpone(days: number) {
    await this.thoughtService.postpone(this.thought, days).catch(e => {
      this.showPostponeDialog = false;
      throw e;
    });
    this.showPostponeDialog = false;
    if (this.callback) {
      this.callback();
    } else {
      this.location.back();
    }
  }
}
