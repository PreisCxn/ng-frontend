import {Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges} from '@angular/core';
import {TranslationService} from "./translation.service";
import {Subscription} from "rxjs";

@Directive({
  selector: '[translation]',
  standalone: true
})
export class TranslationDirective implements OnInit, OnDestroy {

  @Input('translation') languageKey: any;

  private recalcSubscription!: Subscription;
  private recalcBackupSubscription!: Subscription;

  constructor(private ele: ElementRef, private translation: TranslationService, private renderer: Renderer2) {
    this.renderer.setStyle(this.ele.nativeElement, 'visibility', 'hidden');
  }

  ngOnInit() {
    this.recalculateWithBackup(this.languageKey);
  }

  recalculate(): void {
    this.recalcSubscription = this.translation
      .subscribe((language) => {
        const translation: string = this.translation.getTranslation(this.languageKey);
        this.ele.nativeElement.innerText = translation;
        this.updateVisibility(translation);
      });

    this.translation.setLanguage(this.translation.getCurrentLanguage());
  }

  recalculateWithBackup(key: string): void {
    this.recalcBackupSubscription = this.translation.subscribe((language) => {
      this.translation
        .getTranslationWithBackup(key)
        .then((translation) => {
          this.ele.nativeElement.innerText = translation;
          this.updateVisibility(translation);
        });
    });
  }

  private updateVisibility(translation: string): void {
    if (translation == undefined) return;
    if (translation.length > 0) {
      this.renderer.setStyle(this.ele.nativeElement, 'visibility', 'visible');
    } else {
      this.renderer.setStyle(this.ele.nativeElement, 'visibility', 'hidden');
    }
  }

  ngOnDestroy(): void {
    if(this.recalcSubscription)
      this.recalcSubscription.unsubscribe();

    if(this.recalcBackupSubscription)
      this.recalcBackupSubscription.unsubscribe();
  }

}
