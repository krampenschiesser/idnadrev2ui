import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NameFilterComponent } from './name-filter/name-filter.component';
import { ContentFilterComponent } from './content-filter/content-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule
  ],
  declarations: [NameFilterComponent, ContentFilterComponent],
  exports:[NameFilterComponent,ContentFilterComponent]
})
export class FilterModule { }
