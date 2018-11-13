import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtButtonsComponent } from './thought-buttons.component';

describe('ThoughtButtonsComponent', () => {
  let component: ThoughtButtonsComponent;
  let fixture: ComponentFixture<ThoughtButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThoughtButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoughtButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
