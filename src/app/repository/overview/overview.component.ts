import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../repository.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  private repoService: RepositoryService;

  constructor(repoService: RepositoryService) {
    this.repoService = repoService;
  }

  ngOnInit() {
    this.repoService.loadAllRepositories();
  }

}
