import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelcartComponent } from './panelcart.component';

describe('PanelcartComponent', () => {
  let component: PanelcartComponent;
  let fixture: ComponentFixture<PanelcartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelcartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
