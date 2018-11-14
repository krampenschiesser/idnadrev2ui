import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToListPopupComponent } from './add-to-list-popup.component';

describe('AddToListPopupComponent', () => {
  let component: AddToListPopupComponent;
  let fixture: ComponentFixture<AddToListPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddToListPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
