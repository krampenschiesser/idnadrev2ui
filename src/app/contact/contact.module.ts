import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactOverviewComponent } from './contact-overview/contact-overview.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { RouterModule, Routes } from '@angular/router';
import { ViewContactComponent } from './view-contact/view-contact.component';
import { DocumentModule } from '../document/document.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from '../tag/tag.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BlockUIModule, CardModule, CheckboxModule, DialogModule, InputTextModule, MessageModule, MessagesModule, TooltipModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from '../markdown/markdown.module';
import { RepositoryModule } from '../repository/repository.module';
import { FormitemsModule } from '../formitems/formitems.module';
import { ContactArrayInputComponent } from './contact-array-input/contact-array-input.component';
import { PageModule } from '../page/page.module';
import { ContactFilterComponent } from './contact-filter/contact-filter.component';

const routes: Routes = [
  {path: 'contact/edit/:id', component: AddContactComponent},
  {path: 'contact/add', component: AddContactComponent},
  {path: 'contact/:id', component: ViewContactComponent},
  {path: 'contact', component: ContactOverviewComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DocumentModule,
    TableModule,
    ButtonModule,
    TagModule,
    FontAwesomeModule,
    CheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    CardModule,
    DialogModule,
    BlockUIModule,
    MessageModule,
    MessagesModule,
    RepositoryModule,
    FormitemsModule,
    PageModule,
    InputTextModule,
  ],
  declarations: [ContactOverviewComponent, AddContactComponent, ViewContactComponent,  ContactArrayInputComponent, ContactFilterComponent]
})
export class ContactModule {
}
