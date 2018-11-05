import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddThoughtComponent } from './add-thought/add-thought.component';
import { RouterModule, Routes } from '@angular/router';
import { ThoughtOverviewComponent } from './thought-overview/thought-overview.component';
import { ThoughtProcessComponent } from './thought-process/thought-process.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RepositoryModule } from '../repository/repository.module';
import { MarkdownModule } from '../markdown/markdown.module';
import { CardModule } from 'primeng/card';
import { ThoughtPreviewComponent } from './thought-preview/thought-preview.component';
import { TagModule } from '../tag/tag.module';
import { BlockUIModule, CheckboxModule, DialogModule, InputTextModule, MessageModule, MessagesModule, TooltipModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThoughtFilterComponent } from './thought-filter/thought-filter.component';
import { FormitemsModule } from '../formitems/formitems.module';

const routes: Routes = [
  {path: 'thought/process', component: ThoughtProcessComponent},
  {path: 'thought/:id', component: AddThoughtComponent},
  {path: 'thought/add', component: AddThoughtComponent},
  {path: 'thought', component: ThoughtOverviewComponent},
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
    FormitemsModule,
  ],
  declarations: [AddThoughtComponent, ThoughtOverviewComponent, ThoughtProcessComponent, ThoughtPreviewComponent, ThoughtFilterComponent],
  exports:[ThoughtPreviewComponent]
})
export class ThoughtModule { }
