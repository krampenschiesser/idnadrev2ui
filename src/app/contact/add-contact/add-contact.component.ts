import { Component, OnInit } from '@angular/core';
import Contact from '../../dto/Contact';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ContactService } from '../../service/contact.service';
import { last, switchMap } from 'rxjs/operators';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {
  contact: Contact = new Contact('');

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    tags: new FormControl([]),
    repository: new FormControl(undefined, [Validators.required]),
    content: new FormArray([new FormGroup({
      label: new FormControl(''),
      value: new FormControl(''),
    })]),
    details: new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      middleName: new FormControl(),
      company: new FormControl(),
      jobTitle: new FormControl(),
      birthday: new FormControl(),
      emails: new FormArray([new FormControl()]),
      phones: new FormArray([new FormControl()]),
      addresses: new FormArray([new FormControl()]),
    }),
  });
  lastFullName = '';

  creating = false;

  constructor(private route: ActivatedRoute, private contactService: ContactService, private router: Router) {
  }

  ngOnInit() {
    this.form.patchValue(this.contact);
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.contactService.get(params.get('id')))
    ).subscribe(task => {
      if (task) {
        this.contact = task;
        this.lastFullName = task.name;
        this.form.patchValue(this.contact);
      }
    });
    this.form.valueChanges.subscribe(o => {
      let firstName = o.details.firstName;
      let lastName = o.details.lastName;
      if ((firstName && firstName.length > 0) || (lastName && lastName.length > 0)) {
        let fullname = firstName + ' ' + lastName;
        if (fullname !== this.lastFullName) {
          this.lastFullName = fullname;
          o.name = fullname;
          this.form.patchValue({name: fullname});

        }
      }
      o.details.emails = o.details.emails.filter(mail => !!mail);
      o.details.phones = o.details.phones.filter(mail => !!mail);
      o.details.addresses = o.details.addresses.filter(mail => !!mail);
      o.content = o.content.filter(c => !!c.label && !!c.value);
      if (this.form.valid) {
        Object.assign(this.contact, o);
      }
    });
  }

  onDelete() {
    if (this.contact) {
      this.contactService.delete(this.contact);
      this.router.navigate(['/contact']);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.contactService.store(this.contact);
      this.contact = new Contact('');
      this.form.reset();
      this.form.patchValue(this.contact);
    }
  }

  addCustomField() {
    let content = this.form.controls.content as FormArray;
    content.push(new FormGroup({
      label: new FormControl(''),
      value: new FormControl(''),
    }));
  }


  get details() {
    return this.form.controls.details as FormGroup;
  }
}
