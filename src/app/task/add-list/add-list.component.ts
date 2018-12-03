import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Thought from '../../dto/Thought';
import TaskList from '../../dto/TaskList';
import TaskFilter from '../../task-filter/task-filter/TaskFilter';

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
      filter: new FormControl()
    }),
    content: new FormControl([]),
  });

  listInEdit = new TaskList('');
  creating = false;

  constructor() {
  }

  ngOnInit() {
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

  onSubmit() {

  }
}
