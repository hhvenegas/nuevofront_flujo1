import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizadorbComponent } from './cotizadorb.component';

describe('CotizadorbComponent', () => {
  let component: CotizadorbComponent;
  let fixture: ComponentFixture<CotizadorbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CotizadorbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizadorbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
