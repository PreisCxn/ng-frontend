import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAnimComponent } from './custom-anim.component';

describe('CustomAnimComponent', () => {
  let component: CustomAnimComponent;
  let fixture: ComponentFixture<CustomAnimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomAnimComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomAnimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
