import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagInputFormItemComponent } from './tag-input-form-item.component';

describe('TagInputFormItemComponent', () => {
  let component: TagInputFormItemComponent;
  let fixture: ComponentFixture<TagInputFormItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagInputFormItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagInputFormItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
