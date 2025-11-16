import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewOrder } from './create-new-order';

describe('CreateNewOrder', () => {
  let component: CreateNewOrder;
  let fixture: ComponentFixture<CreateNewOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
