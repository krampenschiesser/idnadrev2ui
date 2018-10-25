import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdnadrevFilePreviewComponent } from './indadrev-file-preview.component';

describe('IndadrevFilePreviewComponent', () => {
  let component: IdnadrevFilePreviewComponent;
  let fixture: ComponentFixture<IdnadrevFilePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdnadrevFilePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdnadrevFilePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
