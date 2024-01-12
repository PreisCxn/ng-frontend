import {Inject, Injectable, OnInit, PLATFORM_ID, Renderer2} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {isPlatformBrowser} from "@angular/common";
import {Optional} from "./optional";
import {clearInterval} from "timers";

export enum Themes {
  Dark = "dark",
  Light = "light",
  Auto = "auto"
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService implements OnInit{

  private behavior = new BehaviorSubject<boolean>(true);
  private observer = this.behavior.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.darkMode = this.getModeFromLocalStorage();
  }

  public darkMode: boolean = true;
  public autoMode: boolean = false;
  private autoModeInterval: number | null = null;

  private autoModeHour: Optional<number> = Optional.empty();

  setMode(mode: Themes): void {
    if(mode === Themes.Auto) {
      this.autoMode = true;
      mode = this.calcModeFromTime();
      this.startInterval();
    } else {
      this.autoMode = false;
      this.autoModeHour = Optional.empty();
      this.clearInterval();
    }
    this.changeMode(mode)
    this.saveModeToLocalStorage();
  }

  changeMode(mode: Themes.Light | Themes.Dark): void {
    this.darkMode = mode === Themes.Dark;
    this.behavior.next(this.darkMode);
  }

  private calcModeFromTime(): Themes.Dark | Themes.Light {
    let currentHour = 21;

    if(currentHour >= 6 && currentHour < 18) {
      this.autoModeHour = Optional.of(currentHour - 6);
      return Themes.Light;
    } else {
      let hour = (currentHour + 6) % 12;
      this.autoModeHour = Optional.of(hour);
      return Themes.Dark;
    }

  }

  getAutoModeHour(): Optional<number> {
    return this.autoModeHour;
  }

  is(mode: Themes): boolean {
    if(mode === Themes.Auto)
      return this.autoMode;

    if(this.autoMode)
      return false;

    if(mode === Themes.Dark)
      return this.darkMode;
    else
      return !this.darkMode;
  }

  public toggleMode(): void {
    this.darkMode = !this.darkMode;
    this.behavior.next(this.darkMode);
    this.saveModeToLocalStorage();
  }

  public subscribe(observer: (value: boolean) => void): void {
    this.observer.subscribe(observer);
  }

  private saveModeToLocalStorage(): void {
    if(isPlatformBrowser(this.platformId)) {
      localStorage.setItem('darkMode', this.darkMode ? 'true' : 'false');
    }
  }

  private getModeFromLocalStorage(): boolean {
    if(isPlatformBrowser(this.platformId)) {
      const localStorageValue = localStorage.getItem('darkMode');
      if(localStorageValue === null) // wenn noch kein Wert gesetzt wurde, dann darkmode aktivieren
        return true;

      return localStorageValue === 'true';
    } else
      return true;
  }

  clearInterval(): void {
    if(this.autoModeInterval !== null) {
      window.clearInterval(this.autoModeInterval);
      this.autoModeInterval = null;
    }
  }

  startInterval(): void {
    if(this.is(Themes.Auto)) {
      this.autoModeInterval = window.setInterval(() => {
        if(this.is(Themes.Auto)) {
          this.setMode(Themes.Auto);
        } else {
          this.clearInterval();
        }
      }, 30 * 60 * 1000); // 30 Minuten
    }
  }

  ngOnInit(): void {

  }

}
