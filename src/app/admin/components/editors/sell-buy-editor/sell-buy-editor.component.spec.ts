import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellBuyEditorComponent } from './sell-buy-editor.component';

describe('SellBuyEditorComponent', () => {
  let component: SellBuyEditorComponent;
  let fixture: ComponentFixture<SellBuyEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellBuyEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellBuyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
