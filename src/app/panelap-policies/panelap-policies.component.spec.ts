import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelapPoliciesComponent } from './panelap-policies.component';

describe('PanelapPoliciesComponent', () => {
  let component: PanelapPoliciesComponent;
  let fixture: ComponentFixture<PanelapPoliciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelapPoliciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelapPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
