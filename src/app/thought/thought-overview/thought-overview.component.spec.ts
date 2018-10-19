import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtOverviewComponent } from './thought-overview.component';

describe('ThoughtOverviewComponent', () => {
  let component: ThoughtOverviewComponent;
  let fixture: ComponentFixture<ThoughtOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThoughtOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoughtOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
