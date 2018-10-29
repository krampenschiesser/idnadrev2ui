import { Component, OnInit } from '@angular/core';
import Task from '../../dto/Task';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TaskService } from '../task.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {
  taskToShow?: Task;

  constructor(private route: ActivatedRoute, private taskService: TaskService) {
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

  onEdit() {

  }

  onDelete() {

  }

}
