import {Injectable, Renderer2} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private behavior = new BehaviorSubject<boolean>(true);
  private observer = this.behavior.asObservable();

  constructor() {}

  public darkMode: boolean = true;

  public toggleMode(): void {
    this.darkMode = !this.darkMode;
    this.behavior.next(this.darkMode);
  }

  public subscribe(observer: (value: boolean) => void): void {
    this.observer.subscribe(observer);
  }

}
