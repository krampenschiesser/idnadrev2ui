import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryInputComponent } from './repository-input.component';

describe('RepositoryInputComponent', () => {
  let component: RepositoryInputComponent;
  let fixture: ComponentFixture<RepositoryInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepositoryInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
