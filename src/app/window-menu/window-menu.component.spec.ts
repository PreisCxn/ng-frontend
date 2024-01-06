import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowMenuComponent } from './window-menu.component';

describe('WindowMenuComponent', () => {
  let component: WindowMenuComponent;
  let fixture: ComponentFixture<WindowMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WindowMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WindowMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
