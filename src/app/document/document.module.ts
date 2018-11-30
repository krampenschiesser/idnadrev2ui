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
import { FileTypePipe } from './file-type.pipe';
import { FormitemsModule } from '../formitems/formitems.module';
import { PageModule } from '../page/page.module';
import { DocumentViewComponent } from './document-view/document-view.component';
import { FilterModule } from '../filter/filter.module';

const routes: Routes = [
  {path: 'doc/edit/:id', component: AddDocumentComponent},
  {path: 'doc/add', component: AddDocumentComponent},
  {path: 'doc/:id', component: DocumentViewComponent},
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
    ThoughtModule,
    FormitemsModule,
    PageModule,
    FilterModule
  ],
  declarations: [DocumentOverviewComponent, AddDocumentComponent, DocumentPreviewComponent, IdnadrevFilePreviewComponent, FileTypePipe, DocumentViewComponent],
})
export class DocumentModule { }
