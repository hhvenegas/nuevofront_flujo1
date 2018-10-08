import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelquotesComponent } from './panelquotes.component';

describe('PanelquotesComponent', () => {
  let component: PanelquotesComponent;
  let fixture: ComponentFixture<PanelquotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelquotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelquotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
