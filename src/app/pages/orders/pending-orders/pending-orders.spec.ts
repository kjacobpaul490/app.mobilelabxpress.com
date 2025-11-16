import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingOrders } from './pending-orders';

describe('PendingOrders', () => {
  let component: PendingOrders;
  let fixture: ComponentFixture<PendingOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
