import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, InputTextModule } from 'primeng/primeng';
import { InplaceContentEditorComponent } from './inplace-content-editor/inplace-content-editor.component';
import { InplaceNameEditorComponent } from './inplace-name-editor/inplace-name-editor.component';
import { MarkdownModule } from '../markdown/markdown.module';

@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    MarkdownModule
  ],
  declarations: [InplaceContentEditorComponent, InplaceNameEditorComponent],
  exports: [InplaceContentEditorComponent, InplaceNameEditorComponent]
})
export class InplaceModule { }
