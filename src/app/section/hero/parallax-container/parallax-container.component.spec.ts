import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParallaxContainerComponent } from './parallax-container.component';

describe('PictureComponent', () => {
  let component: ParallaxContainerComponent;
  let fixture: ComponentFixture<ParallaxContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParallaxContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParallaxContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
