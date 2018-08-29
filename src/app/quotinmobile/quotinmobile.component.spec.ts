import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotinmobileComponent } from './quotinmobile.component';

describe('QuotinmobileComponent', () => {
  let component: QuotinmobileComponent;
  let fixture: ComponentFixture<QuotinmobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotinmobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotinmobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
