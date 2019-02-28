import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelticketComponent } from './panelticket.component';

describe('PanelticketComponent', () => {
  let component: PanelticketComponent;
  let fixture: ComponentFixture<PanelticketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelticketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelticketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
