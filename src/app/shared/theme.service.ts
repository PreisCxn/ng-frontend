import {Injectable, Renderer2} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private behavior = new BehaviorSubject<boolean>(true);
  private observer = this.behavior.asObservable();

  constructor(private cookieService: CookieService) {
    this.darkMode = this.getModeFromCookie();
  }

  public darkMode: boolean = true;

  public toggleMode(): void {
    this.darkMode = !this.darkMode;
    this.behavior.next(this.darkMode);
    this.saveModeToCookie();
  }

  public subscribe(observer: (value: boolean) => void): void {
    this.observer.subscribe(observer);
  }

  private saveModeToCookie(): void {
    this.cookieService.set('darkMode', this.darkMode ? 'true' : 'false');
  }

  private getModeFromCookie(): boolean {
    const cookieValue = this.cookieService.get('darkMode');
    return cookieValue === 'true';
  }

}
