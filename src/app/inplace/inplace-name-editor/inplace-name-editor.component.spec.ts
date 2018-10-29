import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InplaceNameEditorComponent } from './inplace-name-editor.component';

describe('InplaceNameEditorComponent', () => {
  let component: InplaceNameEditorComponent;
  let fixture: ComponentFixture<InplaceNameEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InplaceNameEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InplaceNameEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
