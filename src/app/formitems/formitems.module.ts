import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './text-input/text-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { AutoCompleteModule, InputTextModule, MessagesModule } from 'primeng/primeng';
import { RepositoryInputComponent } from './repository-input/repository-input.component';
import { DateInputComponent } from './date-input/date-input.component';
import { RepositorySelectorComponent } from './repository-selector/repository-selector.component';
import { TagInputFormItemComponent } from './tag-input-form-item/tag-input-form-item.component';
import { TagModule } from '../tag/tag.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MessageModule,
    MessagesModule,
    InputTextModule,
    AutoCompleteModule,
    TagModule
  ],
  declarations: [TextInputComponent, RepositoryInputComponent, DateInputComponent, RepositorySelectorComponent, TagInputFormItemComponent],
  exports: [TextInputComponent, RepositoryInputComponent, DateInputComponent,RepositorySelectorComponent,TagInputFormItemComponent]
})
export class FormitemsModule {
}
