import { Pipe, PipeTransform } from '@angular/core';
import { RepositoryService } from '../service/repository.service';

@Pipe({
  name: 'repositoryName'
})
export class RepositoryNamePipe implements PipeTransform {
  private repoService: RepositoryService;


  constructor(repoService: RepositoryService) {
    this.repoService = repoService;
  }

  transform(value: string, args?: any): string {
    let repo = this.repoService._repositories.find(r => r.id === value);
    if (repo) {
      return repo.name;
    } else {
      return value;
    }
  }
}
