import { Component, Input, OnInit } from '@angular/core';
import Task from '../../dto/Task';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TaskService } from '../../task/task.service';
import { switchMap } from 'rxjs/operators';
import { ContactService } from '../contact.service';
import Contact from '../../dto/Contact';

@Component({
  selector: 'app-view-contact',
  templateUrl: './view-contact.component.html',
  styleUrls: ['./view-contact.component.css']
})
export class ViewContactComponent implements OnInit {
  contactToShow?: Contact;

  constructor(private route: ActivatedRoute, private contactService: ContactService, private router: Router) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.contactService.getContact(params.get('id')))
    ).subscribe(task => {
      if (task) {
        this.contactToShow = task;
      }
    });
  }

  onEdit() {
    if (this.contactToShow) {
      this.router.navigate(['/contact/edit/' + this.contactToShow.id]);
    }
  }

  onDelete() {
    if (this.contactToShow) {
      this.contactService.delete(this.contactToShow);
      this.router.navigate(['/contact']);
    }
  }

}
