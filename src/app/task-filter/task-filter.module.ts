import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFilterComponent } from './task-filter/task-filter.component';
import { TaskFilterEarliestStartDateComponent } from './task-filter-earliest-start-date/task-filter-earliest-start-date.component';
import { TaskFilterRemainingTimeComponent } from './task-filter-remaining-time/task-filter-remaining-time.component';
import { TaskFilterStateComponent } from './task-filter-state/task-filter-state.component';
import { ButtonModule } from 'primeng/button';
import { RepositoryModule } from '../repository/repository.module';
import { AutoCompleteModule, CalendarModule, CardModule, DialogModule, InputTextModule, OverlayPanelModule, TooltipModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagModule } from '../tag/tag.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormitemsModule } from '../formitems/formitems.module';
import { TaskSelectionComponent } from './task-selection/task-selection.component';
import { FilterModule } from '../filter/filter.module';
import { DataViewModule } from 'primeng/dataview';
import { MarkdownModule } from '../markdown/markdown.module';
import { TableModule } from 'primeng/table';
import { TaskSelectionPreviewComponent } from './task-selection-preview/task-selection-preview.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    TagModule,
    FontAwesomeModule,
    FormitemsModule,
    CalendarModule,
    DialogModule,
    FilterModule,
    AutoCompleteModule,
    TableModule,
    MarkdownModule,
    CardModule,
    OverlayPanelModule
  ],
  declarations: [TaskFilterComponent,TaskFilterEarliestStartDateComponent,TaskFilterRemainingTimeComponent,TaskFilterStateComponent,TaskSelectionComponent, TaskSelectionPreviewComponent],
  exports: [TaskFilterComponent,TaskSelectionComponent]
})
export class TaskFilterModule { }
