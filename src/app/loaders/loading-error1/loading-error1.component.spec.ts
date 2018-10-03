import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingError1Component } from './loading-error1.component';

describe('LoadingError1Component', () => {
  let component: LoadingError1Component;
  let fixture: ComponentFixture<LoadingError1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingError1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingError1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
