import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRowComponent } from './item-row.component';

describe('RowComponent', () => {
  let component: ItemRowComponent;
  let fixture: ComponentFixture<ItemRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
