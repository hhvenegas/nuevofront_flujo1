import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelpoliciesComponent } from './panelpolicies.component';

describe('PanelpoliciesComponent', () => {
  let component: PanelpoliciesComponent;
  let fixture: ComponentFixture<PanelpoliciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelpoliciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelpoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
