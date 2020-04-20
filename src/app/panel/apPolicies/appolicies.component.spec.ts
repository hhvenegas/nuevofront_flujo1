import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppoliciesComponent } from './appolicies.component';

describe('AppoliciesComponent', () => {
  let component: AppoliciesComponent;
  let fixture: ComponentFixture<AppoliciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppoliciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
