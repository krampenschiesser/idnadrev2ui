import { Component, OnInit } from '@angular/core';
import Contact from '../../dto/Contact';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ContactService } from '../../service/contact.service';
import { switchMap } from 'rxjs/operators';
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
      company: new FormControl(false),
      jobTitle: new FormControl(),
      birthday: new FormControl(),
      emails: new FormArray([new FormControl()]),
      phones: new FormArray([new FormControl()]),
      addresses: new FormArray([new FormControl()]),
    }),
  });

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
        this.form.patchValue(this.contact);
      }
    });
    this.form.valueChanges.subscribe(o=>{
      console.log(o);
    })
  }

  onDelete() {
    if (this.contact) {
      this.contactService.delete(this.contact);
      this.router.navigate(['/contact']);
    }
  }

  onSubmit() {

  }

  addCustomField() {
    let content = this.form.controls.content as FormArray;
    content.push(new FormGroup({
      label: new FormControl(''),
      value: new FormControl(''),
    }))
  }


  get details() {
    return this.form.controls.details as FormGroup;
  }

  addPhoneNumber() {
    let content = this.details.controls.phones as FormArray;
    content.push(new FormControl());
  }

  addEmail() {
    let content = this.details.controls.emails as FormArray;
    content.push(new FormControl());
  }

  addAddress() {
    let content = this.details.controls.adresses as FormArray;
    content.push(new FormControl());
  }
}
