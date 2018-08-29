import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Quotinmobile2Component } from './quotinmobile2.component';

describe('Quotinmobile2Component', () => {
  let component: Quotinmobile2Component;
  let fixture: ComponentFixture<Quotinmobile2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Quotinmobile2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Quotinmobile2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
