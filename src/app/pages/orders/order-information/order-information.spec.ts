import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderInformation } from './order-information';

describe('OrderInformation', () => {
  let component: OrderInformation;
  let fixture: ComponentFixture<OrderInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderInformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderInformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
