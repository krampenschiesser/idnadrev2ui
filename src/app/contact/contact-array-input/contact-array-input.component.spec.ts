import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactArrayInputComponent } from './contact-array-input.component';

describe('ContactArrayInputComponent', () => {
  let component: ContactArrayInputComponent;
  let fixture: ComponentFixture<ContactArrayInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactArrayInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactArrayInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
