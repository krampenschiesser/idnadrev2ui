import {Component, OnInit} from '@angular/core';
import Task from '../../dto/Task';
import {DisplayService} from '../../service/display.service';
import {TaskService} from '../../service/task.service';

@Component({
  selector: 'app-active-task',
  templateUrl: './active-task.component.html',
  styleUrls: ['./active-task.component.css']
})
export class ActiveTaskComponent implements OnInit {
  task?: Task;
  allActiveTasks: Task[] = [];

  constructor(private taskService: TaskService, private display: DisplayService) {
  }

  ngOnInit() {
    this.taskService.loadAllTasksOnce();
    this.taskService.tasks.subscribe(t => {
      let activeTasks = Array.from(t.values()).filter(t => t.isInProgress());
      this.allActiveTasks = activeTasks;
      if (activeTasks.length > 0) {
        this.task = activeTasks[0];
      }
    });
  }

  taskLabelStyle() {
    let length = this.display.width - (this.display.xsOnly ? 185 : 200);
    return {
      'width': length + 'px',
      'overflow': 'hidden',
      'display': 'grid',
      'text-overflow': 'ellipsis'
    };
  }

  onStopWork() {
    this.taskService.finishTask(this.task).then(() => this.resetTask());
  }

  onStartTask() {

  }

  onFinish() {
    this.taskService.finishTask(this.task).then(() => this.resetTask());
  }

  private resetTask() {
    this.removeFromActiveTasks();
    this.task = undefined;

    if (this.allActiveTasks.length > 0) {
      this.task = this.allActiveTasks[0];
    }
  }

  private removeFromActiveTasks() {
    let index = this.allActiveTasks.indexOf(this.task);
    if (index >= 0) {
      this.allActiveTasks.splice(index, 1);
    }
  }
}
