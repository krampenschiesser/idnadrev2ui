import { Component, OnInit } from '@angular/core';
import { faDatabase, faBook, faClipboardList, faInbox } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.css']
})
export class MainNavigationComponent implements OnInit {
  reposIcon = faDatabase;
  docsIcon = faBook;
  tasksIcon = faClipboardList;
  inboxIcon = faInbox

  constructor() {
  }

  ngOnInit() {
  }

}
