import { Component, OnInit } from '@angular/core';
import TaskFilter, { filterTasks } from '../../task-filter/task-filter/TaskFilter';
import TaskList from '../../dto/TaskList';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TaskService } from '../../service/task.service';
import { DisplayService } from '../../service/display.service';
import { ListService } from '../../service/list.service';
import Task from '../../dto/Task';
import { RowChange } from '../list-preview/list-preview.component';
import { FileId } from '../../dto/FileId';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {
  _list?: TaskList;
  activeFilter: TaskFilter = {tags: []};
  tasks = [];
  allTasks = [];
  showTaskSelection = false;

  constructor(private route: ActivatedRoute, private listService: ListService, private taskService: TaskService, public display: DisplayService, private router: Router) {
  }

  ngOnInit() {
    console.log('init ', this.allTasks);
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.listService.get(params.get('id')))
    ).subscribe(list => {
      if (list) {
        this.list = list;
      }
    });
  }

  set list(list: TaskList) {
    this._list = list;

    this.taskService.getTasksForList(list).then(tasks => {
      this.allTasks = tasks;

      this.onFilter(this.activeFilter);
    });
  }

  get list() {
    return this._list;
  }

  onFilter(filter: TaskFilter) {
    let map = new Map();
    this.allTasks.forEach(t => map.set(t.id, t));
    this.tasks = filterTasks(filter, map, false);
  }

  onEdit() {
    this.router.navigate(['/list/edit/' + this.list.id]);
  }

  onDelete() {
    this.listService.delete(this._list);
  }

  async addToList(task: Task) {
    await this.listService.addTasksToList(this.list, [task.id]);
    this.showTaskSelection = false;
    this.tasks.push(task);
  }

  async changeTaskRowIndex(event: RowChange) {

    let modList = this.list;
    let content = modList.content.slice();

    let index1 = content.indexOf(event.from);
    let index2 = event.to === undefined ? undefined : content.indexOf(event.to);

    let elementToMove = content.splice(index1, 1)[0];
    if (index2 === undefined) {
      content.push(elementToMove);
    } else {
      content.splice(index2, 0, elementToMove);
    }

    modList.content=content;
    await this.listService.store(modList);
    this.list = modList;
  }
}
