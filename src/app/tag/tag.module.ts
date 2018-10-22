import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagviewComponent } from './tagview/tagview.component';
import { TagInputComponent } from './taginput/tag-input.component';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    AutoCompleteModule,
    FormsModule
  ],
  declarations: [TagviewComponent, TagInputComponent],
  exports: [TagviewComponent,TagInputComponent]
})
export class TagModule { }
