import { Component, HostListener, OnInit } from '@angular/core';
import IdnadrevFile from '../../dto/IdnadrevFile';
import IdnadrevFileFilter, { filterFiles } from '../../filter/IdnadrevFileFilter';
import { Router } from '@angular/router';
import { DocumentService } from '../../service/document.service';
import { ThoughtService } from '../../service/thought.service';
import { TaskService } from '../../service/task.service';
import Task from '../../dto/Task';
import TaskFilter from '../TaskFilter';
import { FileId } from '../../dto/FileId';
import { MessageService, TreeNode } from 'primeng/api';

@Component({
  selector: 'app-task-overview',
  templateUrl: './task-overview.component.html',
  styleUrls: ['./task-overview.component.css']
})
export class TaskOverviewComponent implements OnInit {
  tasks: Task[];
  allTasks: Map<FileId, Task>;
  nodes: TreeNode[];

  tableRows = 20;
  activeFilter?: TaskFilter;

  constructor(private router: Router, private taskService: TaskService, private messageService: MessageService) {
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
    let tasks = new Set();

    filterFiles(Array.from(this.allTasks.values()), filter).forEach(t => tasks.add(t));

    const addParent = (parents: Task[], id?: FileId) => {
      if (id) {
        let parent = this.allTasks.get(id);
        if (parent && !tasks.has(parent)) {
          parents.push(parent);
        }
      }
    };

    Array.from(tasks).forEach(t => {
      let parents: Task[] = [];
      addParent(parents, t.parent);
      while (parents.length !== 0) {
        let parent = parents.splice(0, 1)[0];
        tasks.add(parent);
        addParent(parents, parent.parent);
      }
    });
    this.tasks = Array.from(tasks);
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

  finish(task: Task) {
    this.taskService.finishTask(task)//
      .then(() => this.messageService.add({severity: 'success', summary: 'Finished task ' + task.name}))
      .catch(() => this.messageService.add({severity: 'error', summary: 'Could not finish task ' + task.name}));
  }
}
