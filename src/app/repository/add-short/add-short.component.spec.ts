import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShortComponent } from './add-short.component';

describe('AddShortComponent', () => {
  let component: AddShortComponent;
  let fixture: ComponentFixture<AddShortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddShortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
