import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TaskModule} from "../task/task.module";
import {ThoughtModule} from "../thought/thought.module";
import { DocumentOverviewComponent } from './document-overview/document-overview.component';
import { AddDocumentComponent } from './add-document/add-document.component';
import { DocumentPreviewComponent } from './document-preview/document-preview.component';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RepositoryModule } from '../repository/repository.module';
import { MarkdownModule } from '../markdown/markdown.module';
import { CardModule } from 'primeng/card';
import { TagModule } from '../tag/tag.module';
import { BlockUIModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, MessageModule, MessagesModule, TooltipModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdnadrevFilePreviewComponent } from './idnadrev-file-preview/idnadrev-file-preview.component';
import { IdnadrevFileFilterComponent } from './idnadrev-file-filter/idnadrev-file-filter.component';
import { FileTypePipe } from './file-type.pipe';

const routes: Routes = [
  {path: 'doc/:id', component: AddDocumentComponent},
  {path: 'doc/add', component: AddDocumentComponent},
  {path: 'doc', component: DocumentOverviewComponent},
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
    TaskModule,
    ThoughtModule
  ],
  declarations: [DocumentOverviewComponent, AddDocumentComponent, DocumentPreviewComponent, IdnadrevFilePreviewComponent, IdnadrevFileFilterComponent, FileTypePipe]
})
export class DocumentModule { }
