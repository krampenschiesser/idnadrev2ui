import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtViewComponent } from './thought-view.component';

describe('ThoughtViewComponent', () => {
  let component: ThoughtViewComponent;
  let fixture: ComponentFixture<ThoughtViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThoughtViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoughtViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
