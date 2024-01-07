import {Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID, Renderer2, ViewChild} from '@angular/core';
import {ThemeService} from "../shared/theme.service";
import {isPlatformBrowser, NgClass, NgStyle} from "@angular/common";
import {Optional} from "../shared/optional";
import {TranslationService} from "../shared/translation.service";

@Component({
  selector: 'app-window-menu',
  standalone: true,
  imports: [
    NgClass,
    NgStyle
  ],
  templateUrl: './window-menu.component.html',
  styleUrl: './window-menu.component.scss'
})
export class WindowMenuComponent implements OnInit{

  @Input() heading: Optional<string> = Optional.empty();

  openState: boolean = false;
  timestamp: Optional<number> = Optional.empty();

  // @ts-ignore
  @ViewChild('menu') menu: ElementRef;

  // @ts-ignore
  private clickOutsideListener: (event: MouseEvent) => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public theme: ThemeService,
    public translation: TranslationService,
    private render: Renderer2) {
  }

  open() {
    this.render.setStyle(this.menu.nativeElement, 'z-index', '999');
    this.timestamp = Optional.of(new Date().getTime());
    this.openState = true;
  }

  close() {
    this.timestamp = Optional.empty();
    this.openState = false;
    setTimeout(() => {
      this.render.setStyle(this.menu.nativeElement, 'z-index', '-9999');
    }, 200);
  }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)) {
      this.clickOutsideListener = this.handleClickOutside.bind(this);
      document.addEventListener('click', this.clickOutsideListener);
    }
  }

  private handleClickOutside(event: MouseEvent): void {
    if(this.openState && this.timestamp.isPresent() && new Date().getTime() - this.timestamp.get() > 500) {
      console.log(!this.menu.nativeElement.contains(event.target))
      if (!this.menu.nativeElement.contains(event.target)) {
        this.close();
      }
    }
  }

}
