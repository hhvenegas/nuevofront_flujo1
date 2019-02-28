import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelcalldetailsComponent } from './panelcalldetails.component';

describe('PanelcalldetailsComponent', () => {
  let component: PanelcalldetailsComponent;
  let fixture: ComponentFixture<PanelcalldetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelcalldetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelcalldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
