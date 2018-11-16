import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromodoroComponent } from './promodoro.component';

describe('PromodoroComponent', () => {
  let component: PromodoroComponent;
  let fixture: ComponentFixture<PromodoroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromodoroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromodoroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
