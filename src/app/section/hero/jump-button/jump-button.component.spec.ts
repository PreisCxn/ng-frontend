import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JumpButtonComponent } from './jump-button.component';

describe('JumpButtonComponent', () => {
  let component: JumpButtonComponent;
  let fixture: ComponentFixture<JumpButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JumpButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JumpButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
