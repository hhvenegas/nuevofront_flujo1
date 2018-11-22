import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensualidadcompletaComponent } from './mensualidadcompleta.component';

describe('MensualidadcompletaComponent', () => {
  let component: MensualidadcompletaComponent;
  let fixture: ComponentFixture<MensualidadcompletaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensualidadcompletaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensualidadcompletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
