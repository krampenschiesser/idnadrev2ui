import { Component, OnInit } from '@angular/core';
import TaskList from '../../dto/TaskList';
import IdnadrevFileFilter, { filterFiles } from '../../filter/IdnadrevFileFilter';
import { ListService } from '../../service/list.service';
import { DisplayService } from '../../service/display.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-overview',
  templateUrl: './list-overview.component.html',
  styleUrls: ['./list-overview.component.css']
})
export class ListOverviewComponent implements OnInit {

  lists: TaskList[];
  allLists: TaskList[];
  selectedList?: TaskList;

  constructor(private listService: ListService, public display: DisplayService, private router: Router) { }


  async ngOnInit() {
    await this.listService.loadAll();
    this.listService.files.subscribe(lists => {
      this.allLists= lists;
      this.lists = lists;
    });
  }

  onFilter(filter: IdnadrevFileFilter) {
    this.lists= filterFiles(this.allLists, filter);
  }

  showView(thought: TaskList) {
    this.router.navigate(['/list/' + this.selectedList.id]);
  }

  showPreview(list: TaskList) {
    this.selectedList = list;
  }

  addList() {
    this.router.navigate(['/list/add']);
  }
}
