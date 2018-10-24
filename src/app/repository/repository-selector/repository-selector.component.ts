import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RepositoryService } from '../repository.service';
import { AbstractControl } from '@angular/forms';
import { RepositoryId } from '../../dto/RepositoryId';
import Repository from '../../dto/Repository';
import { Tag } from '../../dto/Tag';

@Component({
  selector: 'app-repository-selector',
  templateUrl: './repository-selector.component.html',
  styleUrls: ['./repository-selector.component.css']
})
export class RepositorySelectorComponent implements OnInit {
  @Input() parentFormControl: AbstractControl;
  @Input() label?: string;
  @Output('SelectedRepo') selectedRepoEmitter = new EventEmitter<RepositoryId>();
  selectedRepo: Repository;
  results: Repository[] = [];
  all: Repository[] = [];

  constructor(private repoService: RepositoryService) {
  }

  ngOnInit() {
    let selectFirst = true;
    if (this.parentFormControl) {
      let value = this.parentFormControl.value;
      if (value) {
        this.selectedRepo = value;
        selectFirst = false;
      }
    }
    this.repoService.repositories.subscribe(next => {
      this.all = next.filter(r => r.isOpen());

      if (selectFirst && next.length > 0) {
        this.selectedRepo = next[0];
        this.parentFormControl.patchValue(this.selectedRepo.id);
        this.selectedRepoEmitter.emit(this.selectedRepo.id);
      }
    });
  }

  onSelect(repo: Repository) {
    this.parentFormControl.patchValue(repo.id);
    this.selectedRepoEmitter.emit(repo.id);
  }

  search(event: any) {
    this.results = this.all.filter(r => r.name.toLocaleLowerCase().startsWith(event.query.toLocaleLowerCase()));
  }
}
