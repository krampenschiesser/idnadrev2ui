import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import IdnadrevFileFilter, { filterFiles } from '../../filter/IdnadrevFileFilter';
import { TemplateService } from '../../service/template.service';
import { DisplayService } from '../../service/display.service';
import Template from '../../dto/Template';

@Component({
  selector: 'app-template-selection',
  templateUrl: './template-selection.component.html',
  styleUrls: ['./template-selection.component.css']
})
export class TemplateSelectionComponent implements OnInit {
  selectedTemplate?: Template;
  templates: Template[] = [];
  activeFilter: IdnadrevFileFilter = {tags: []};
  @Output('selectedTemplate') onTemplate = new EventEmitter<Template>();
  private allTemplates: Template[];

  constructor(private templateService: TemplateService, public display: DisplayService) {
  }

  async ngOnInit() {
    await this.templateService.loadAll();
    this.templateService.files.subscribe(files => {
      this.allTemplates = files;
      if (this.activeFilter) {
        this.onFilter(this.activeFilter);
      } else {
        this.templates = this.allTemplates.slice();
      }
    });
  }

  onFilter(filter: IdnadrevFileFilter) {
    this.templates = filterFiles(this.allTemplates, filter);
    this.activeFilter = filter;
  }

  selectTemplate(template) {
    this.onTemplate.emit(template);
  }

  showPreview(template) {
    this.selectedTemplate = template;
  }
}
