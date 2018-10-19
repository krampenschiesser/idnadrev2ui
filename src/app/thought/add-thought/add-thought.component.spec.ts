import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddThoughtComponent } from './add-thought.component';

describe('AddThoughtComponent', () => {
  let component: AddThoughtComponent;
  let fixture: ComponentFixture<AddThoughtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddThoughtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddThoughtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
