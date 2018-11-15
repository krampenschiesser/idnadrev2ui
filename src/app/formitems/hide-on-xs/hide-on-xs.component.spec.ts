import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HideOnXSComponent } from './hide-on-xs.component';

describe('HideOnXSComponent', () => {
  let component: HideOnXSComponent;
  let fixture: ComponentFixture<HideOnXSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HideOnXSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HideOnXSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
