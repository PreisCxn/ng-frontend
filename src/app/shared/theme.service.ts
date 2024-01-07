import {Inject, Injectable, PLATFORM_ID, Renderer2} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {isPlatformBrowser} from "@angular/common";

export enum Themes {
  Dark = "dark",
  Light = "light"
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private behavior = new BehaviorSubject<boolean>(true);
  private observer = this.behavior.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.darkMode = this.getModeFromLocalStorage();
  }

  public darkMode: boolean = true;

  setMode(mode: Themes): void {
    this.darkMode = mode === Themes.Dark;
    this.behavior.next(this.darkMode);
    this.saveModeToLocalStorage();
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

}
