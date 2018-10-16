import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../repository.service';
import Repository from '../../dto/Repository';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  private repoService: RepositoryService;
  repositories: Repository[];

  constructor(repoService: RepositoryService) {
    this.repoService = repoService;
  }

  ngOnInit() {
    this.repoService.loadAllRepositories();
    this.repoService.repositories.subscribe(repos=>this.repositories=repos);
  }

}
