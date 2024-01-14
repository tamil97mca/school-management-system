import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEntryModalComponent } from './student-entry-modal.component';

describe('StudentEntryModalComponent', () => {
  let component: StudentEntryModalComponent;
  let fixture: ComponentFixture<StudentEntryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentEntryModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentEntryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
