import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NameFilterComponent } from './name-filter/name-filter.component';
import { ContentFilterComponent } from './content-filter/content-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, CheckboxModule, DropdownModule, InputTextModule } from 'primeng/primeng';
import { CheckboxFilterComponent } from './checkbox-filter/checkbox-filter.component';
import { IdnadrevFileFilterComponent } from './idnadrev-file-filter/idnadrev-file-filter.component';
import { TagModule } from '../tag/tag.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule,
    DropdownModule,
    TagModule,
    ButtonModule
  ],
  declarations: [NameFilterComponent, ContentFilterComponent, CheckboxFilterComponent, IdnadrevFileFilterComponent],
  exports:[NameFilterComponent,ContentFilterComponent, CheckboxFilterComponent, IdnadrevFileFilterComponent]
})
export class FilterModule { }
