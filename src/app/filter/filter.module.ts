import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NameFilterComponent } from './name-filter/name-filter.component';
import { ContentFilterComponent } from './content-filter/content-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule, InputTextModule } from 'primeng/primeng';
import { CheckboxFilterComponent } from './checkbox-filter/checkbox-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule
  ],
  declarations: [NameFilterComponent, ContentFilterComponent, CheckboxFilterComponent],
  exports:[NameFilterComponent,ContentFilterComponent, CheckboxFilterComponent]
})
export class FilterModule { }
