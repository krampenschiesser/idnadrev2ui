import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {
  AccordionModule,
  AutoCompleteModule,
  BlockUIModule, CalendarModule,
  CheckboxModule, ConfirmationService, ConfirmDialogModule,
  DialogModule,
  DropdownModule,
  InputTextModule,
  MessageModule,
  MessagesModule, OverlayPanelModule, SelectButtonModule, TabViewModule,
  TooltipModule, TreeTableModule
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {MarkdownModule} from '../markdown/markdown.module';
import {RepositoryModule} from '../repository/repository.module';
import {TagModule} from '../tag/tag.module';
import {AddTaskComponent} from './add-task/add-task.component';
import {TaskOverviewComponent} from './task-overview/task-overview.component';
import {TaskPreviewComponent} from './task-preview/task-preview.component';
import { TaskViewComponent } from './task-view/task-view.component';
import { InplaceModule } from '../inplace/inplace.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormitemsModule } from '../formitems/formitems.module';
import { PageModule } from '../page/page.module';
import { TaskButtonsComponent } from './task-buttons/task-buttons.component';
import { AddToListPopupComponent } from './add-to-list-popup/add-to-list-popup.component';
import { FilterModule } from '../filter/filter.module';
import { DataViewModule } from 'primeng/dataview';
import { TaskFilterModule } from '../task-filter/task-filter.module';
import { ListOverviewComponent } from './list-overview/list-overview.component';
import { ListViewComponent } from './list-view/list-view.component';
import { AddListComponent } from './add-list/add-list.component';
import { ListPreviewComponent } from './list-preview/list-preview.component';
import { TaskSchedulingComponent } from './task-scheduling/task-scheduling.component';

const routes: Routes = [
  {path: 'task/edit/:id', component: AddTaskComponent},
  {path: 'task/add', component: AddTaskComponent},
  {path: 'task/:id', component: TaskViewComponent},
  {path: 'task', component: TaskOverviewComponent},
  {path: 'list/edit/:id', component: AddListComponent},
  {path: 'list/add', component: AddListComponent},
  {path: 'list/:id', component: ListViewComponent},
  {path: 'list', component: ListOverviewComponent},
  {path: 'schedule', component: TaskSchedulingComponent},
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
    DropdownModule,
    TreeTableModule,
    InplaceModule,
    CalendarModule,
    AutoCompleteModule,
    AccordionModule,
    SelectButtonModule,
    FontAwesomeModule,
    FormitemsModule,
    PageModule,
    ConfirmDialogModule,
    OverlayPanelModule,
    FilterModule,
    DataViewModule,
    TaskFilterModule
  ],
  declarations: [TaskPreviewComponent, TaskOverviewComponent, AddTaskComponent, TaskViewComponent, TaskButtonsComponent, AddToListPopupComponent, ListOverviewComponent, ListViewComponent, AddListComponent, ListPreviewComponent, TaskSchedulingComponent],
  exports: [TaskPreviewComponent],
})
export class TaskModule {
}
