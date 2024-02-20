import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceRetentionComponent } from './price-retention.component';

describe('PriceRetentionComponent', () => {
  let component: PriceRetentionComponent;
  let fixture: ComponentFixture<PriceRetentionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceRetentionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PriceRetentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
