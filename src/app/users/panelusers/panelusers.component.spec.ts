import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelusersComponent } from './panelusers.component';

describe('PanelusersComponent', () => {
  let component: PanelusersComponent;
  let fixture: ComponentFixture<PanelusersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelusersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
