import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import IdnadrevFile from '../../dto/IdnadrevFile';
import IdnadrevFileFilter, { filterFiles } from '../../filter/IdnadrevFileFilter';
import { DocumentService } from '../document.service';
import Thought from '../../dto/Thought';
import Task from '../../dto/Task';
import BinaryFile from '../../dto/BinaryFile';
import Document from '../../dto/Document';
import { ThoughtService } from '../../thought/thought.service';

@Component({
  selector: 'app-document-overview',
  templateUrl: './document-overview.component.html',
  styleUrls: ['./document-overview.component.css']
})
export class DocumentOverviewComponent implements OnInit {
  selectedFile?: IdnadrevFile<any, any>;
  files: IdnadrevFile<any, any>[];
  allFiles: IdnadrevFile<any, any>[];

  tableRows = 20;
  activeFilter?: IdnadrevFileFilter;

  constructor(private router: Router, private docService: DocumentService, private thoughtService: ThoughtService) {
  }

  async ngOnInit() {
    await this.docService.allFiles();
    this.docService.files.subscribe(files => {
      this.allFiles = files;
      if (this.activeFilter) {
        this.onFilter(this.activeFilter);
      } else {
        this.files = this.allFiles;
      }
      if (this.files.length > 0) {
        this.selectedFile = this.files[0];
      } else {
        this.selectedFile = undefined;
      }
    });
  }

  addDoc() {
    this.router.navigate(['/doc/add']);
  }

  onFilter(filter: IdnadrevFileFilter) {
    this.files = filterFiles(this.allFiles, filter);
    this.activeFilter = filter;
    if (this.files.length === 0) {
      this.selectedFile = undefined;
    }
  }

  showPreview(file: IdnadrevFile<any, any>) {
    this.selectedFile = file;
  }

  onEdit() {
    if (this.selectedFile instanceof Thought) {
      this.router.navigate(['/thought/' + this.selectedFile.id]);
    } else if (this.selectedFile instanceof Task) {
      this.router.navigate(['/task/' + this.selectedFile.id]);
    } else if (this.selectedFile instanceof BinaryFile) {
      // this.router.navigate(['/thought/' + this.selectedThought.id]);
    } else if (this.selectedFile instanceof Document) {
      this.router.navigate(['/doc/' + this.selectedFile.id]);
    }
  }

  onDelete() {
    this.docService.deleteFile(this.selectedFile);
  }
}
