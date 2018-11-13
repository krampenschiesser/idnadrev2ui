import { Component, OnInit } from '@angular/core';
import Thought from '../../dto/Thought';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ThoughtService } from '../../service/thought.service';
import { switchMap } from 'rxjs/operators';
import Document from '../../dto/Document';
import { DocumentService } from '../../service/document.service';

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  styleUrls: ['./document-view.component.css']
})
export class DocumentViewComponent implements OnInit {
  docToShow?: Document;

  constructor(private route: ActivatedRoute, private docService: DocumentService, private router: Router) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.docService.getDoc(params.get('id')))
    ).subscribe(task => {
      if (task) {
        this.docToShow= task;
      }
    });
  }

  onEdit() {
    if (this.docToShow) {
      this.router.navigate(['/doc/edit/' + this.docToShow.id]);
    }
  }

  onDelete() {
    if (this.docToShow) {
      this.docService.delete(this.docToShow);
      this.router.navigate(['/doc']);
    }
  }
}
