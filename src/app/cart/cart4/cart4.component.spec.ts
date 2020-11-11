import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cart4Component } from './cart4.component';

describe('Cart4Component', () => {
  let component: Cart4Component;
  let fixture: ComponentFixture<Cart4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cart4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cart4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
