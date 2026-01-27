import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidenceDataComponent } from './residence-data.component';

describe('ResidenceDataComponent', () => {
  let component: ResidenceDataComponent;
  let fixture: ComponentFixture<ResidenceDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResidenceDataComponent]
    });
    fixture = TestBed.createComponent(ResidenceDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
