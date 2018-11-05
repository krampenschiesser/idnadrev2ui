import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetFieldButtonComponent } from './reset-field-button.component';

describe('ResetFieldButtonComponent', () => {
  let component: ResetFieldButtonComponent;
  let fixture: ComponentFixture<ResetFieldButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetFieldButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetFieldButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
