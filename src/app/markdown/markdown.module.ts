import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownViewerComponent } from './markdown-viewer/markdown-viewer.component';
import { MarkdownEditorComponent } from './markdown-editor/markdown-editor.component';
import { FormsModule } from '@angular/forms';
import { TemplateSelectionComponent } from './template-selection/template-selection.component';
import { MarkdownButtonsComponent } from './markdown-buttons/markdown-buttons.component';
import { FilterModule } from '../filter/filter.module';
import { TagModule } from '../tag/tag.module';
import { TemplatePreviewComponent } from './template-preview/template-preview.component';
import { TableModule } from 'primeng/table';
import { ButtonModule, DialogModule, InputTextModule, TooltipModule } from 'primeng/primeng';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FilterModule,
    TagModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    TooltipModule,
    DialogModule
  ],
  declarations: [MarkdownViewerComponent, MarkdownEditorComponent, TemplateSelectionComponent, MarkdownButtonsComponent, TemplatePreviewComponent,],
  exports: [MarkdownViewerComponent, MarkdownEditorComponent]
})
export class MarkdownModule {
}
