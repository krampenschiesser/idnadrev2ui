import { Component, OnInit } from '@angular/core';
import Task from '../../dto/Task';
import { TaskService } from '../../service/task.service';
import { DisplayService } from '../../service/display.service';

@Component({
  selector: 'app-active-task',
  templateUrl: './active-task.component.html',
  styleUrls: ['./active-task.component.css']
})
export class ActiveTaskComponent implements OnInit {
  task?: Task;

  constructor(private taskService: TaskService, private display: DisplayService) {
  }

  ngOnInit() {
    this.taskService.tasks.subscribe(t => {
      let value: Task | undefined = t.values().next().value;
      if (value) {
        this.task = value;
      }
    });
  }

  taskLabelStyle() {
    let length = this.display.width - (this.display.xsOnly ? 185: 200);
    return {
      'width': length + 'px',
      'overflow': 'hidden',
      'display': 'grid',
      'text-overflow': 'ellipsis'
    };
  }
}
