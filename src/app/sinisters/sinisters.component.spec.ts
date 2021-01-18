import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SinistersComponent } from './sinisters.component';

describe('SinistersComponent', () => {
  let component: SinistersComponent;
  let fixture: ComponentFixture<SinistersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinistersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinistersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
