import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaUpdateFormComponent } from './persona-update-form.component';

describe('PersonaUpdateFormComponent', () => {
  let component: PersonaUpdateFormComponent;
  let fixture: ComponentFixture<PersonaUpdateFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonaUpdateFormComponent]
    });
    fixture = TestBed.createComponent(PersonaUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
