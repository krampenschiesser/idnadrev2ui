import { Injectable } from '@angular/core';
import { Tag } from '../dto/Tag';
import { RepositoryService } from '../repository/repository.service';
import { BehaviorSubject } from 'rxjs';
import Repository from '../dto/Repository';
import { addToViewTree } from '@angular/core/src/render3/instructions';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  public allTags = new BehaviorSubject<Tag[]>([]);
  _allTags: Tag[] = [];

  constructor(private repoService: RepositoryService) {
  }

  async reload() {
    await this.repoService.loadAllRepositories();
    this.repoService.openRepositories.map(r => r.getTagIndex.getAllValues()).forEach(given => {
      for (let tag of Array.from(given)) {
        if (tag) {
          if (this._allTags.findIndex(t => t.name.toLocaleLowerCase() === tag.name.toLocaleLowerCase()) == -1) {
            this._allTags.push(tag);
          }
        }
      }
    });
    this.notifyChanges();
  }

  notifyChanges() {
    this.allTags.next(this._allTags.slice());
  }

  addTag(tag: string): Tag  {
    let index = this._allTags.findIndex(t => t.name.toLocaleLowerCase() === tag.toLocaleLowerCase());
    if (index == -1) {
      let t = new Tag(tag);
      this._allTags.push(t);
      return t;
    }else {
      return this._allTags[index];
    }
  }

  getAsTag(tags: string[]): Tag[] {
    let retval = [];
    for (const tag of tags) {
      let found = this._allTags.find(t=>t.name===tag);
      if(!found) {
        retval.push(this.addTag(tag));
      }else {
        retval.push(found)
      }
    }
    return retval;
  }
}
