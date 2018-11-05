import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import Repository from '../../dto/Repository';
import { RepositoryService } from '../../service/repository.service';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  private repoService: RepositoryService;
  repositories: Repository[];
  showLoginDialog: boolean;
  repoToLogin?: Repository;

  @ViewChild('pw') pwField: ElementRef<HTMLInputElement>;
  private messageService: MessageService;

  constructor(repoService: RepositoryService, messageService: MessageService) {
    this.repoService = repoService;
    this.messageService = messageService;
  }

  ngOnInit() {
    this.repoService.loadAllRepositories();
    this.repoService.repositories.subscribe(repos => {
      repos.sort((a, b) => a.name.localeCompare(b.name));
      this.repositories = repos;

    });
  }

  openRepo(pw: string) {
    this.repoService.openRepository(this.repoToLogin.id, pw).then(() => {
      this.messageService.add({key: 'loginMsgs', severity: 'success', summary: 'Successfully logged into ' + this.repoToLogin.name});
      this.repoToLogin = undefined;
      this.showLoginDialog = false;
      this.pwField.nativeElement.value = '';
    }).catch(() => {
      this.messageService.add({key: 'loginMsgs', severity: 'error', summary: 'Login to ' + this.repoToLogin.name + ' failed'});
      this.repoToLogin = undefined;
      this.showLoginDialog = false;
      this.pwField.nativeElement.value = '';
    });
  }

  loginRepo(repo: Repository) {
    this.repoToLogin = repo;
    this.showLoginDialog = true;
    setTimeout(() => {
      this.pwField.nativeElement.focus();
      console.log(this.pwField.nativeElement);
    }, 100);
  }

  logoutRepo(repo: Repository) {
    this.repoService.logout(repo.id);
    this.messageService.add({key: 'loginMsgs', severity: 'success', summary: 'Logged out of ' + repo.name});
  }
}
