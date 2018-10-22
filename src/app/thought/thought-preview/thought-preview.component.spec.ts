import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtPreviewComponent } from './thought-preview.component';

describe('ThoughtPreviewComponent', () => {
  let component: ThoughtPreviewComponent;
  let fixture: ComponentFixture<ThoughtPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThoughtPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoughtPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
