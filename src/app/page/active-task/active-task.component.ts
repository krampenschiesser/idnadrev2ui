import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import Task from '../../dto/Task';
import { DisplayService } from '../../service/display.service';
import { TaskService } from '../../service/task.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RepositoryService } from '../../service/repository.service';

@Component({
  selector: 'app-active-task',
  templateUrl: './active-task.component.html',
  styleUrls: ['./active-task.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class ActiveTaskComponent implements OnInit {
  task?: Task;
  allActiveTasks: Task[] = [];
  showTaskSelection = false;
  repoInputClass: string | null = null;

  form = new FormGroup({
    name: new FormControl(undefined, [Validators.required]),
    repo: new FormControl(undefined, [Validators.required]),
  });

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
    this.display.mdObservable.subscribe(newVal => {
      if (newVal) {
        this.repoInputClass = null;
      } else {
        this.repoInputClass = 'RepoInputSmall';
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
    this.taskService.stopWork(this.task).then(() => this.resetTask());
  }

  onStartTask() {
    this.showTaskSelection = true;
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

  async workOnTask(task: Task) {
    await this.taskService.startWork(task);
    this.task = task;
    this.showTaskSelection = false;
  }

  async onWorkOnNewTask() {
    let formValue = this.form.value;
    let task = new Task(formValue.name);
    task.repository = formValue.repo;
    console.log(task);
    await this.taskService.store(task);
    await this.taskService.startWork(task);
    this.showTaskSelection = false;
    this.task = task;
    this.form.reset({repo: formValue.repo});
  }

}
