import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichapagoComponent } from './fichapago.component';

describe('FichapagoComponent', () => {
  let component: FichapagoComponent;
  let fixture: ComponentFixture<FichapagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichapagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichapagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
