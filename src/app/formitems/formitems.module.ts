import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './text-input/text-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { AutoCompleteModule, ButtonModule, CalendarModule, InputTextModule, MessagesModule, OverlayPanelModule } from 'primeng/primeng';
import { RepositoryInputComponent } from './repository-input/repository-input.component';
import { DateInputComponent } from './date-input/date-input.component';
import { RepositorySelectorComponent } from './repository-selector/repository-selector.component';
import { TagInputFormItemComponent } from './tag-input-form-item/tag-input-form-item.component';
import { TagModule } from '../tag/tag.module';
import { ResetFieldButtonComponent } from './reset-field-button/reset-field-button.component';
import { HideOnXSComponent } from './hide-on-xs/hide-on-xs.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MessageModule,
    MessagesModule,
    InputTextModule,
    AutoCompleteModule,
    TagModule,
    ButtonModule,
    CalendarModule,
    OverlayPanelModule
  ],
  declarations: [TextInputComponent, RepositoryInputComponent, DateInputComponent, RepositorySelectorComponent, TagInputFormItemComponent, ResetFieldButtonComponent, HideOnXSComponent],
  exports: [TextInputComponent, RepositoryInputComponent, DateInputComponent,RepositorySelectorComponent,TagInputFormItemComponent,ResetFieldButtonComponent,HideOnXSComponent]
})
export class FormitemsModule {
}
