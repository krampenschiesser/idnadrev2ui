import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InplaceContentEditorComponent } from './inplace-content-editor.component';

describe('InplaceContentEditorComponent', () => {
  let component: InplaceContentEditorComponent;
  let fixture: ComponentFixture<InplaceContentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InplaceContentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InplaceContentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
