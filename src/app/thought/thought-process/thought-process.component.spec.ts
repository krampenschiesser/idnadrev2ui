import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtProcessComponent } from './thought-process.component';

describe('ThoughtProcessComponent', () => {
  let component: ThoughtProcessComponent;
  let fixture: ComponentFixture<ThoughtProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThoughtProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoughtProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
