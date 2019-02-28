import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelsellersComponent } from './panelsellers.component';

describe('PanelsellersComponent', () => {
  let component: PanelsellersComponent;
  let fixture: ComponentFixture<PanelsellersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelsellersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelsellersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
