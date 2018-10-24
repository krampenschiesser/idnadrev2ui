import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtFilterComponent } from './thought-filter.component';

describe('ThoughtFilterComponent', () => {
  let component: ThoughtFilterComponent;
  let fixture: ComponentFixture<ThoughtFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThoughtFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoughtFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
