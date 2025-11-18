import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Physicians } from './physicians';

describe('Physicians', () => {
  let component: Physicians;
  let fixture: ComponentFixture<Physicians>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Physicians]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Physicians);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
