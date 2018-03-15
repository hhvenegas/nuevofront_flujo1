import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesopagoComponent } from './procesopago.component';

describe('ProcesopagoComponent', () => {
  let component: ProcesopagoComponent;
  let fixture: ComponentFixture<ProcesopagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcesopagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesopagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
