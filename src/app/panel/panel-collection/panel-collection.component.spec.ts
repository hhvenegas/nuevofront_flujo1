import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelCollectionComponent } from './panel-collection.component';

describe('PanelCollectionComponent', () => {
  let component: PanelCollectionComponent;
  let fixture: ComponentFixture<PanelCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
