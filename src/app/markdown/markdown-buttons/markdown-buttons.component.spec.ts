import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownButtonsComponent } from './markdown-buttons.component';

describe('MarkdownButtonsComponent', () => {
  let component: MarkdownButtonsComponent;
  let fixture: ComponentFixture<MarkdownButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkdownButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
