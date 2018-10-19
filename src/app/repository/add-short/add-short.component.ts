import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RepositoryService } from '../repository.service';

@Component({
  selector: 'app-add-repo-short',
  templateUrl: './add-short.component.html',
  styleUrls: ['./add-short.component.css']
})
export class AddShortComponent implements OnInit {
  addForm = new FormGroup({
    name: new FormControl(''),
    password: new FormControl(''),
  });

  msgs = [];
  private repoService: RepositoryService;

  creating = false;

  constructor(repoService: RepositoryService) {
    this.repoService = repoService;
  }

  ngOnInit() {
  }

  async createRepo(name: string, pw: string) {
    this.creating = true;
    await this.repoService.createRepository(name, pw).catch(() => this.creating = false);
    this.creating = false;
    this.addForm.reset();
  }

  hidePwInfo() {
    this.msgs = [];
  }

  showPwInfo() {
    this.msgs.push({severity: 'info', summary: 'If you loose/forget this password your repository will be unusable<br/>', detail: 'We use this password for encryption so without the password, decryption is not possible and your data is not accessible anymore'});
  }
}
