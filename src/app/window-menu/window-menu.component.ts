import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ThemeService} from "../shared/theme.service";
import {isPlatformBrowser, NgClass, NgStyle} from "@angular/common";
import {Optional} from "../shared/optional";
import {TranslationService} from "../shared/translation.service";
import {TranslationDirective} from "../shared/translation.directive";

@Component({
  selector: 'app-window-menu',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    TranslationDirective
  ],
  templateUrl: './window-menu.component.html',
  styleUrl: './window-menu.component.scss'
})
export class WindowMenuComponent implements OnInit, OnDestroy {

  private static readonly WINDOWS: WindowMenuComponent[] = [];

  @Input() heading: Optional<string> = Optional.empty();

  openState: boolean = false;
  timestamp: Optional<number> = Optional.empty();

  windowHasFocus: boolean = true;

  // @ts-ignore
  @ViewChild('menu') menu: ElementRef;

  // @ts-ignore
  private clickOutsideListener: (event: MouseEvent) => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public theme: ThemeService,
    public translation: TranslationService,
    private render: Renderer2,
    private ele: ElementRef) {
  }

  open() {
    WindowMenuComponent.closeAll(this);
    this.render.setStyle(this.ele.nativeElement, 'display', 'inline-block');
    setTimeout(() => {
      this.timestamp = Optional.of(new Date().getTime());
      this.openState = true;
    }, 50);
  }

  public static closeAll(ignore: WindowMenuComponent | null = null): void {
    WindowMenuComponent.WINDOWS.forEach(window => {
      if (window !== ignore) {
        window.close();
      }
    });
  }

  close() {
    this.timestamp = Optional.empty();
    this.openState = false;
    setTimeout(() => {
      this.render.setStyle(this.ele.nativeElement, 'display', 'none');
    }, 200);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.clickOutsideListener = this.handleClickOutside.bind(this);
      document.addEventListener('mousedown', this.clickOutsideListener);
      window.addEventListener('focus', this.handleWindowFocus.bind(this));
      window.addEventListener('blur', this.handleWindowBlur.bind(this));
    }
    WindowMenuComponent.WINDOWS.push(this);
    this.close();
  }

  ngOnDestroy() {
    WindowMenuComponent.WINDOWS.splice(WindowMenuComponent.WINDOWS.indexOf(this), 1);
  }

  private handleClickOutside(event: MouseEvent): void {
    if (!this.windowHasFocus) {
      return;
    }

    if (this.openState && this.timestamp.isPresent() && new Date().getTime() - this.timestamp.get() > 500) {
      if (!this.menu.nativeElement.contains(event.target) && !this.clickInBoundingBox(event)) {

        this.close();
      }
    }
  }

  private handleWindowFocus(): void {
    console.log('window focus')
    setTimeout(() => {
      this.windowHasFocus = true;
    }, 300);

  }

  private handleWindowBlur(): void {
    console.log('window blur')
    this.windowHasFocus = false;
  }

  private clickInBoundingBox(event: MouseEvent): boolean {
    const rect = this.menu.nativeElement.getBoundingClientRect();
    return event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
  }

}
