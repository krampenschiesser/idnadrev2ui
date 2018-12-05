import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../service/task.service';
import Task from '../../dto/Task';
import { FileId } from '../../dto/FileId';
import { MessageService, TreeNode } from 'primeng/api';
import { DisplayService } from '../../service/display.service';
import TaskFilter, { filterTasks } from '../../task-filter/task-filter/TaskFilter';

@Component({
  selector: 'app-task-overview',
  templateUrl: './task-overview.component.html',
  styleUrls: ['./task-overview.component.css']
})
export class TaskOverviewComponent implements OnInit {
  tasks: Task[];
  allTasks: Map<FileId, Task>;
  nodes: TreeNode[];
  selection: Task[] = [];
  oldSelection?: Task[];
  tableRows = 20;
  activeFilter: TaskFilter = {finished: false, tags: []};
  showListSelection = false;
  blocked = false;

  constructor(private router: Router, private taskService: TaskService, private messageService: MessageService, public display: DisplayService) {
  }

  async ngOnInit() {
    await this.taskService.loadAllTasks();
    this.taskService.tasks.subscribe(files => {
      this.allTasks = files;
      if (this.activeFilter) {
        this.onFilter(this.activeFilter);
      } else {
        this.tasks = Array.from(this.allTasks.values());
      }
      this.generateTreeItems();
    });
  }

  onFilter(filter: TaskFilter) {
    this.tasks = filterTasks(filter,this.allTasks,true);
    this.activeFilter = filter;
    this.generateTreeItems();
  }

  generateTreeItems() {
    let map = new Map<FileId, Task>();
    this.tasks.forEach(t => map.set(t.id, t));
    this.nodes = this.tasks.filter(t => !t.parent).map(t => this.toTreeNode(t));
  }

  toTreeNode(task: Task): TreeNode {
    let children = undefined;
    if (task.children) {
      children = task.children.map(c => this.toTreeNode(c));
    }
    let node: TreeNode = {
      data: task,
      children: children,
      leaf: children === undefined,
      expanded: true
    };
    return node;
  }

  addTask() {
    this.router.navigate(['/task/add']);
  }

  showPreview(task: Task) {
    this.router.navigate(['/task/' + task.id]);
  }

  delete(task: Task) {
    this.taskService.delete(task)//
      .then(() => this.messageService.add({severity: 'success', summary: 'Deleted task ' + task.name}))
      .catch(() => this.messageService.add({severity: 'error', summary: 'Could not delete task ' + task.name}));
  }

  edit(task: Task) {
    this.router.navigate(['/task/edit/' + task.id]);
  }

  addToList(task: Task) {
    this.oldSelection = this.selection.slice();
    this.selection = [task];
    this.showListSelection = true;
  }

  listSelectionDone() {
    this.showListSelection = false;
    if (this.oldSelection) {
      this.selection = this.oldSelection;
      this.oldSelection = undefined;
    }
  }

  addAllToList(tasks: Task[]) {

  }

  async deleteAll(tasks: Task[]) {
    this.blocked = true;
    this.taskService.deleteAll(tasks)
      .then(() => {
        this.messageService.add({severity: 'success', summary: 'Deleted ' + tasks.length + ' tasks '});
        this.blocked = false;
      })
      .catch(() => {
        this.messageService.add({severity: 'error', summary: 'Could not delete tasks'});
        this.blocked = false;
      });
  }

  finishAll(tasks: Task[]) {
    this.blocked = true;
    this.taskService.finishAll(tasks)
      .then(() => {
        this.messageService.add({severity: 'success', summary: 'Finished ' + tasks.length + ' tasks '});
        this.blocked = false;
      })
      .catch(() => {
        this.messageService.add({severity: 'error', summary: 'Could not finish tasks'});
        this.blocked = false;
      });
  }


  finish(task: Task) {
    this.blocked = true;
    this.taskService.finishTask(task)//
      .then(() => {
        this.messageService.add({severity: 'success', summary: 'Finished task ' + task.name});
        this.blocked=false;
      })
      .catch(() => {
        this.messageService.add({severity: 'error', summary: 'Could not finish task ' + task.name});
        this.blocked=false;
      });
  }

  get actionWidth() {
    if (this.display.xsOnly) {
      return 70;
    } else if (this.display.md) {
      return 200;
    } else if (this.display.sm) {
      return 105;
    }
  }

  get selectActionWidth() {
    if (this.selection.length > 0) {
      if (this.display.xsOnly) {
        return 70;
      } else if (this.display.sm) {
        return 105;
      }
    } else {
      return 40;
    }
  }

}
