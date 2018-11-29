import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSelectionPreviewComponent } from './task-selection-preview.component';

describe('TaskSelectionPreviewComponent', () => {
  let component: TaskSelectionPreviewComponent;
  let fixture: ComponentFixture<TaskSelectionPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskSelectionPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSelectionPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
