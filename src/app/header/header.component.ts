import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {HeaderService, MenuActives} from "../shared/header.service";
import {CommonModule, isPlatformBrowser, NgOptimizedImage} from "@angular/common";
import {TranslationDirective} from "../shared/translation.directive";
import {TranslationService} from "../shared/translation.service";
import {Languages} from "../shared/languages";
import {Themes, ThemeService} from "../shared/theme.service";
import {Router, RouterLink} from "@angular/router";
import {RedirectService} from "../shared/redirect.service";
import lottie from "lottie-web";
import {Modes} from "../mode/shared/modes";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {WindowMenuComponent} from "../window-menu/window-menu.component";
import {Optional} from "../shared/optional";
import {ModeService} from "../mode/shared/mode.service";
import {CategoryEntry} from "../shared/types/categories.types";
import {DataService} from "../shared/data.service";
import {AuthService} from "../shared/auth.service";


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    TranslationDirective,
    NgOptimizedImage,
    FormsModule,
    WindowMenuComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent implements OnInit, AfterViewInit {
  // @ts-ignore
  @ViewChild('lottiemenu') lottieMenu: ElementRef;
  // @ts-ignore
  @ViewChild('header') header: ElementRef;
  @ViewChild('searchInputEle') searchInputEle: ElementRef | undefined;
  @ViewChild('categoryWindow') categoryWindow!: WindowMenuComponent;
  @ViewChild('loginWindow') loginWindow!: WindowMenuComponent;
  @ViewChild('userNameInput') userNameInput!: ElementRef;
  @ViewChild('loginRememberMe') loginRememberMe!: ElementRef;

  searchInput: string = '';

  // @ts-ignore
  private clickOutsideListener: (event: MouseEvent) => void;

  protected loginError: boolean = false;

  private menuAnimation: any; // menu animation object

  public innerWidth: number = 0;

  isLoaded: boolean = false;

  public menuOpen: boolean = false;

  // @ts-ignore
  loginForm: FormGroup;

  private categories: CategoryEntry[] = this.headerService.categories.orElse([]);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public translationService: TranslationService,
    protected headerService: HeaderService,
    public theme: ThemeService,
    public redirectService: RedirectService,
    protected modeService: ModeService,
    protected auth: AuthService) {

  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.innerWidth = window.innerWidth;
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'f' && (event.ctrlKey || event.metaKey)) {
      if(this.searchInputEle == undefined) return;
      if(!this.headerService.showSearch) return;
      event.preventDefault();
      this.searchInputEle.nativeElement.focus();
      console.log()
      this.onSearchClick();
    }
    if(event.key === 'Escape') {
      if(this.menuOpen) {
        this.toggleMenu();
      }
      if(this.loginWindow.openState && document.activeElement !== this.loginRememberMe.nativeElement) {
        this.loginWindow.close();
      }
    }
    if(event.key === 'Enter') {
      if(document.activeElement === this.loginRememberMe.nativeElement) {
        this.loginRememberMe.nativeElement.checked = !this.loginRememberMe.nativeElement.checked;
      }
    }
  }

  public openCategoryWindow(): void {
    if (!this.categoryWindow.openState)
      this.categoryWindow.open();
    else
      this.categoryWindow.close();
  }

  public openLoginWindow(): void {
    this.loginError = false;
    if (!this.loginWindow.openState) {
      this.loginWindow.open();
      if(this.userNameInput !== undefined)
        this.userNameInput.nativeElement.focus();
    }
    else
      this.loginWindow.close();
  }

  public closeAllMenus(): void {
    WindowMenuComponent.closeAll();
    this.closeMenu();
  }

  toggleLanguage(): void {
    switch (this.translationService.getCurrentLanguage()) {
      case Languages.English:
        this.translationService.setLanguage(Languages.German);
        break;
      case Languages.German:
        this.translationService.setLanguage(Languages.MemeCxn);
        break;
      case Languages.MemeCxn:
        this.translationService.setLanguage(Languages.English);
        break;
      default:
        this.translationService.setLanguage(Languages.English);
        break;
    }
  }

  ngOnInit(): void {
    this.isLoaded = true;
    this.headerService.setHeaderComponent(this);
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
      rememberMe: new FormControl(false),
    });
  }

  public toggleMenu(): void {
    if (this.menuOpen) {
      this.menuAnimation.playSegments([29, 0], true); // play animation in reverse from frame 90 to 0
    } else {
      this.closeAllMenus();
      this.menuAnimation.playSegments([0, 29], true); // play animation forward from frame 0 to 90
    }
    this.menuOpen = !this.menuOpen;
  }

  private handleClickOutside(event: MouseEvent): void {
    if (this.menuOpen) {
      if (!this.header.nativeElement.contains(event.target)) {
        this.toggleMenu();
      }
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.menuAnimation = lottie.loadAnimation({
        container: this.lottieMenu.nativeElement,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'assets/img/icons/menu.json'
      });

      this.menuAnimation.setSpeed(2.0);

      if (this.menuOpen) {
        this.menuAnimation.goToAndStop(29, true);
      }

      this.clickOutsideListener = this.handleClickOutside.bind(this);
      document.addEventListener('click', this.clickOutsideListener);
    }
  }

  public activeMenuIs(menu: MenuActives): boolean {
    return this.headerService.activeMenuIs(menu);
  }

  public closeMenu(): void {
    if (this.menuOpen) {
      this.toggleMenu();
    }
  }

  protected login(): void {
    if(document.activeElement === this.loginRememberMe.nativeElement) return;
    this.auth.login(this.loginForm.value.username, this.loginForm.value.password, this.loginForm.value.rememberMe)
      .then(() => {
        this.loginError = false;
        console.log("login success3")
        this.loginWindow.close();
        this.auth.isAdmin().then(isAdmin => {
          if (isAdmin) {
            this.redirectService.redirectIfError('admin');
          } else {
            this.redirectService.redirectIfError();
          }
        });
      })
      .catch(() => {
        this.loginError = true;
      });
  }

  logout(): void {
    this.auth.logout();
    if(this.redirectService.isOnAdmin()) {
      this.redirectService.reloadPage();
      return;
    }
    this.auth.checkForMaintenance().then(maintenance => {
      if (maintenance) {
        this.redirectService.reloadPage();
      }
    });
  }

  protected preventDrag(event: DragEvent) {
    event.preventDefault();
  }

  protected getLocationHref(): string {
    return window.location.href;
  }

  protected onSearchClick(): void {
    this.closeMenu();
    this.redirectService.jumpToTable(true);
  }

  protected checkFocus():boolean {
    return this.searchInput !== "";
    //return !!(this.searchInputEle && this.searchInputEle.nativeElement === document.activeElement);
  }

  protected unfocus(): void {
    console.log("1")
      this.searchInput = "";
    this.headerService.onSearchInput("");
    console.log("2")
  }

  protected readonly MenuActives = MenuActives;
  protected readonly Modes = Modes;
  protected readonly Languages = Languages;
  protected readonly Themes = Themes;
  protected readonly Optional = Optional;
  protected readonly ModeService = ModeService;
}
