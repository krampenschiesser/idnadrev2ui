import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdnadrevFileFilterComponent } from './idnadrev-file-filter.component';

describe('IdnadrevFileFilterComponent', () => {
  let component: IdnadrevFileFilterComponent;
  let fixture: ComponentFixture<IdnadrevFileFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdnadrevFileFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdnadrevFileFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
