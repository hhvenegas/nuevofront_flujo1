import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelpromotionsComponent } from './panelpromotions.component';

describe('PanelpromotionsComponent', () => {
  let component: PanelpromotionsComponent;
  let fixture: ComponentFixture<PanelpromotionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelpromotionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelpromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
