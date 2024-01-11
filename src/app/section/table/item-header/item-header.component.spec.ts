import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemHeaderComponent } from './item-header.component';

describe('HeaderComponent', () => {
  let component: ItemHeaderComponent;
  let fixture: ComponentFixture<ItemHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
