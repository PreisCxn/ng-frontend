import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public darkMode: boolean = true;

  public toggleMode(): void {
    this.darkMode = !this.darkMode;
  }

}
