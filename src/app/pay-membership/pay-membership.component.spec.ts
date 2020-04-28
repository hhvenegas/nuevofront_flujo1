import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayMembershipComponent } from './pay-membership.component';

describe('PayMembershipComponent', () => {
  let component: PayMembershipComponent;
  let fixture: ComponentFixture<PayMembershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayMembershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
