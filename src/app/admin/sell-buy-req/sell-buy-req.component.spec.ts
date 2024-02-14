import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellBuyReqComponent } from './sell-buy-req.component';

describe('SellBuyReqComponent', () => {
  let component: SellBuyReqComponent;
  let fixture: ComponentFixture<SellBuyReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellBuyReqComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellBuyReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
