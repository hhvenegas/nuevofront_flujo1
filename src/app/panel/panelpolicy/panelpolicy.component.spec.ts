import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelpolicyComponent } from './panelpolicy.component';

describe('PanelpolicyComponent', () => {
  let component: PanelpolicyComponent;
  let fixture: ComponentFixture<PanelpolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelpolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelpolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
