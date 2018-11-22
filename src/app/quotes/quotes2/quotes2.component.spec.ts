import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Quotes2Component } from './quotes2.component';

describe('Quotes2Component', () => {
  let component: Quotes2Component;
  let fixture: ComponentFixture<Quotes2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Quotes2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Quotes2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
