import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPhysician } from './add-physician';

describe('AddPhysician', () => {
  let component: AddPhysician;
  let fixture: ComponentFixture<AddPhysician>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPhysician]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPhysician);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
