import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecargacompletaComponent } from './recargacompleta.component';

describe('RecargacompletaComponent', () => {
  let component: RecargacompletaComponent;
  let fixture: ComponentFixture<RecargacompletaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecargacompletaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecargacompletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
