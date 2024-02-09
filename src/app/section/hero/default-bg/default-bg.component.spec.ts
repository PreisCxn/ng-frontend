import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultBGComponent } from './default-bg.component';

describe('DefaultBGComponent', () => {
  let component: DefaultBGComponent;
  let fixture: ComponentFixture<DefaultBGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultBGComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DefaultBGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
