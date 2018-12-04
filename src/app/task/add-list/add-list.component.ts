import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Thought from '../../dto/Thought';
import TaskList from '../../dto/TaskList';
import TaskFilter from '../../task-filter/task-filter/TaskFilter';
import Contact from '../../dto/Contact';
import { ListService } from '../../service/list.service';
import { falseIfMissing } from 'protractor/built/util';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.css']
})
export class AddListComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    tags: new FormControl([]),
    repository: new FormControl(undefined, [Validators.required]),
    details: new FormGroup({
      filter: new FormControl(),
      manualSorting: new FormControl(),
    }),
    content: new FormControl([]),
  });

  listInEdit = new TaskList('');
  creating = false;

  constructor(private listService: ListService, private messageService: MessageService) {
  }

  ngOnInit() {
    this.form.patchValue(this.listInEdit);
    this.form.valueChanges.subscribe(v => {
      console.log(v);
    });
  }

  toggleManual() {
    if (this.isFiltered) {
      this.form.patchValue({
        details: {
          filter: undefined,
        }
      });
    } else {
      this.form.patchValue({
        details: {
          filter: {
            tags: [],
          }
        }
      });
    }
  }

  get isFiltered() {
    // @ts-ignore
    return !!this.form.controls.details.controls.filter.value;
  }

  setFilter(filter: TaskFilter) {

    this.form.patchValue({
      details: {
        filter: filter,
      }
    });
  }

  async onSubmit() {
    if (this.form.valid) {
      this.creating = true;
      Object.assign(this.listInEdit, this.form.value);

      await this.listService.store(this.listInEdit).catch(e => {
        console.log('could not create list', this.listInEdit, e);
        this.messageService.add({severity: 'error', summary: 'Could not create list ' + this.listInEdit.name});
        this.creating = false;
      });

      this.messageService.add({severity: 'success', summary: 'Successfully created list ' + this.listInEdit.name});
      this.listInEdit = new TaskList('');
      this.form.reset();
      this.form.patchValue(this.listInEdit);
      this.creating = false;
    }
  }
}
