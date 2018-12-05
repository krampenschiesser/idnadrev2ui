import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faDatabase, faBook, faTasks, faInbox, faHome, faUsers, faListAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.css']
})
export class MainNavigationComponent implements OnInit {
  reposIcon = faDatabase;
  docsIcon = faBook;
  tasksIcon = faTasks;
  inboxIcon = faInbox;
  homeIcon = faHome;
  usersIcon = faUsers;
  listsIcon = faListAlt;
  scheduleIcon = faCalendarAlt;
  @Output() onClick = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit() {
  }

}
