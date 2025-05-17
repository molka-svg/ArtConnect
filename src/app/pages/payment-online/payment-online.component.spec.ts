import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOnlineComponent } from './payment-online.component';

describe('PaymentOnlineComponent', () => {
  let component: PaymentOnlineComponent;
  let fixture: ComponentFixture<PaymentOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentOnlineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
