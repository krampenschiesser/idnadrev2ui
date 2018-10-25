import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {
  BlockUIModule,
  CheckboxModule,
  DialogModule,
  DropdownModule,
  InputTextModule,
  MessageModule,
  MessagesModule,
  TooltipModule
} from "primeng/primeng";
import {TableModule} from "primeng/table";
import {MarkdownModule} from "../markdown/markdown.module";
import {RepositoryModule} from "../repository/repository.module";
import {TagModule} from "../tag/tag.module";
import {AddTaskComponent} from './add-task/add-task.component';
import {TaskOverviewComponent} from './task-overview/task-overview.component';
import {TaskPreviewComponent} from './task-preview/task-preview.component';

const routes: Routes = [
  {path: 'task/:id', component: AddTaskComponent},
  {path: 'task/add', component: AddTaskComponent},
  {path: 'task', component: TaskOverviewComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableModule,
    ButtonModule,
    RepositoryModule,
    MarkdownModule,
    CardModule,
    TagModule,
    TooltipModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    MessageModule,
    MessagesModule,
    BlockUIModule,
    CheckboxModule,
    DropdownModule
  ],
  declarations: [TaskPreviewComponent, TaskOverviewComponent, AddTaskComponent],
  exports: [TaskPreviewComponent],
})
export class TaskModule {
}
