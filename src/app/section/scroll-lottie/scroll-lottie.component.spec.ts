import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollLottieComponent } from './scroll-lottie.component';

describe('ScrollGifComponent', () => {
  let component: ScrollLottieComponent;
  let fixture: ComponentFixture<ScrollLottieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollLottieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollLottieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
