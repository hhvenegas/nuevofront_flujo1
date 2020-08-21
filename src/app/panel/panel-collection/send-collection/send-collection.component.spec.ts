import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCollectionComponent } from './send-collection.component';

describe('SendCollectionComponent', () => {
  let component: SendCollectionComponent;
  let fixture: ComponentFixture<SendCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
