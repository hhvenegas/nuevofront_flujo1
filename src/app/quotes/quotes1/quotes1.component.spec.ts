import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Quotes1Component } from './quotes1.component';

describe('Quotes1Component', () => {
  let component: Quotes1Component;
  let fixture: ComponentFixture<Quotes1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Quotes1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Quotes1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
