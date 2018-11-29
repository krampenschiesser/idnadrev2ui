import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import Repository from '../../dto/Repository';
import { RepositoryService } from '../../service/repository.service';

@Component({
  selector: 'app-repository-selector',
  templateUrl: './repository-selector.component.html',
  styleUrls: ['./repository-selector.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RepositorySelectorComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RepositorySelectorComponent),
      multi: true,
    }]
})
export class RepositorySelectorComponent implements OnInit, ControlValueAccessor {
  @Input() label?: string;

  selectedRepo: Repository;
  results: Repository[] = [];
  all: Repository[] = [];

  private onChange: any;
  private onTouched: any;

  selectFirst = true;
  styleClass = 'FormInputWithDropDown';

  constructor(private repoService: RepositoryService) {
  }

  async ngOnInit() {
    await this.repoService.waitLoadAllRepositoriesOnce();

    this.repoService.repositories.subscribe(next => {
      this.all = next.filter(r => r.isOpen());
      if (this.selectFirst && next.filter(n => n.isOpen()).length > 0) {
        this.selectedRepo = next.filter(n => n.isOpen())[0];
        this.onChange(this.selectedRepo.id);
      }
    });
  }

  @Input('inputStyleClass') set inputStyleClass(clazz: string | undefined) {
    if (clazz) {
      this.styleClass = clazz;
    }
  }

  onSelect(repo: Repository) {
    this.onChange(repo.id);
  }

  search(event: any) {
    this.results = this.all.filter(r => r.name.toLocaleLowerCase().startsWith(event.query.toLocaleLowerCase()));
  }


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  async writeValue(obj: any) {
    if (obj) {
      this.selectFirst = false;
      await this.repoService.waitLoadAllRepositoriesOnce();
      this.selectedRepo = this.repoService.getRepository(obj);
    } else {
      if (this.all.filter(n => n.isOpen()).length > 0) {
        this.selectedRepo = this.all.filter(n => n.isOpen())[0];
        this.onChange(this.selectedRepo.id);
      } else {
        this.selectedRepo = undefined;
      }
    }
  }

  public validate(c: FormControl) {
    if (this.selectedRepo === undefined) {
      return {'repository': {valid: false}};
    } else {
      return null;
    }
  }
}
