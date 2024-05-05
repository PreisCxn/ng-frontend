import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import lottie from "lottie-web";
import {Subject} from "rxjs";

@Component({
  selector: 'app-lottie',
  standalone: true,
  imports: [],
  templateUrl: './lottie.component.html',
  styleUrl: './lottie.component.scss'
})
export class LottieComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('lottieContainer') lottieContainer!: ElementRef;

  @Input('lottieUrl') lottieUrl!: string;
  @Input('replaceImgs') replaceImgs: string[] | undefined = undefined;
  @Input('observerPlay') observerPlay: Subject<void> | undefined = undefined;

  private animation: any;

  constructor() {
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    if (this.animation)
      this.animation.destroy();
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    console.log(this.lottieUrl)
    if(!this.observerPlay)
      this.initAnimation();

    if (this.observerPlay)
      this.observerPlay.subscribe(() => {
        this.initAnimation(true);
      });
    else
      window.addEventListener('scroll', () => {
        this.onScroll();
      });
  }

  private onScroll() {
    if (!this.animation) return;
    if (!this.lottieContainer) return;

    const rect = this.lottieContainer.nativeElement.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      // Berechnen Sie den Scroll-Fortschritt als Prozentsatz
      const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

      // Setzen Sie den aktuellen Frame basierend auf dem Scroll-Fortschritt
      const currentFrame = Math.floor(scrollProgress * this.animation.totalFrames);
      this.animation.goToAndStop(currentFrame, true);
    }
  }

  private initAnimation(autoPlay: boolean = false) {
    this.downloadAnimation(this.lottieUrl)
      .then((data) => {

        const dataCopy = JSON.parse(JSON.stringify(data));

        dataCopy.assets.forEach((asset: any, index: number) => {
          asset.u = "";
          if (this.replaceImgs && this.replaceImgs[index])
            asset.p = this.replaceImgs[index];
          else
            asset.p = this.getDefaultImgPath(asset.p);
        });

        this.animation = lottie.loadAnimation({
          container: this.lottieContainer.nativeElement,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: dataCopy
        });

        if(autoPlay)
          this.animation.play();
      });
  }

  private async downloadAnimation(path: string) {
    try {
      return await import(`../../../assets/${path}/data.json`);
    } catch (error) {
      console.error(`Could not load Anim: /assets/${path}/data.json`, error);
      throw error;
    }
  }

  private getDefaultImgPath(imgName: string) {
    return `assets/${this.lottieUrl}/images/${imgName}`;
  }

}
