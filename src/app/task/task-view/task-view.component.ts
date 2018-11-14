import { Component, OnInit } from '@angular/core';
import Task from '../../dto/Task';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TaskService } from '../../service/task.service';
import { switchMap } from 'rxjs/operators';
import { DisplayService } from '../../service/display.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {
  taskToShow?: Task;

  constructor(private route: ActivatedRoute, private taskService: TaskService, public display: DisplayService,private router: Router) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.taskService.getTask(params.get('id')))
    ).subscribe(task => {
      if (task) {
        this.taskToShow = task;
      }
    });
  }

  setNewName(newName: string) {
    this.taskToShow.name = newName;
    this.taskService.store(this.taskToShow);
  }

  setNewContent(content: string) {
    this.taskToShow.content = content;
    this.taskService.store(this.taskToShow);
  }

  goToOverview() {
    this.router.navigate(['/task']);
  }

}
