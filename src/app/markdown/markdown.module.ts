import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownViewerComponent } from './markdown-viewer/markdown-viewer.component';
import { MarkdownEditorComponent } from './markdown-editor/markdown-editor.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    CodemirrorModule,
    FormsModule
  ],
  declarations: [MarkdownViewerComponent, MarkdownEditorComponent],
  exports: [MarkdownViewerComponent,MarkdownEditorComponent]
})
export class MarkdownModule { }
