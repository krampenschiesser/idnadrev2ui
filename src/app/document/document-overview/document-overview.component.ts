import { Component, OnInit } from '@angular/core';
import IdnadrevFile from '../../dto/IdnadrevFile';
import { Router } from '@angular/router';
import { DocumentService } from '../document.service';
import IdnadrevFileFilter, { filterFiles } from '../../filter/IdnadrevFileFilter';

@Component({
  selector: 'app-document-overview',
  templateUrl: './document-overview.component.html',
  styleUrls: ['./document-overview.component.css']
})
export class DocumentOverviewComponent implements OnInit {
  selectedFile?: IdnadrevFile<any, any>;
  files: IdnadrevFile<any, any>[];
  allFiles: IdnadrevFile<any, any>[];

  tableRows=20;

  constructor(private router: Router, private docService: DocumentService) {
  }

  async ngOnInit() {
    await this.docService.allFiles();
    this.docService.files.subscribe(files => {
      this.allFiles = files;
      this.files = this.allFiles;
      if (this.files.length > 0) {
        this.selectedFile = this.files[0];
      }
    });
  }

  addDoc() {
    this.router.navigate(['/doc/add']);
  }

  onFilter(filter: IdnadrevFileFilter) {
    this.files = filterFiles(this.allFiles, filter);
  }

  showPreview(file: IdnadrevFile<any, any>) {

  }
}
