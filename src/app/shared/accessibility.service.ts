import {Inject, Injectable, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {Optional} from "./optional";
import {Themes} from "./theme.service";
import {Subject} from "rxjs";

export enum Accessibility {
  ON = "on",
  OFF = "off"
}

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {

  private state: Accessibility = Accessibility.OFF;

  private observer:Subject<Accessibility> = new Subject<Accessibility>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.getFromLocalStorage();
  }

  setAccessibility(newState: Accessibility) {
    this.state = newState;
    this.observer.next(newState);
    this.saveToLocalStorage();
  }

  is(state: Accessibility): boolean {
    return this.state === state;
  }

  get(): Accessibility {
    return this.state;
  }

  saveToLocalStorage() {
    if(isPlatformBrowser(this.platformId)) {
      localStorage.setItem("accessibility", this.state);
    }
  }

  getFromLocalStorage() {
    if(isPlatformBrowser(this.platformId)) {
      let state = localStorage.getItem("accessibility");
      if(state && (state === Accessibility.ON || state === Accessibility.OFF)) {
        this.setAccessibility(state as Accessibility);
      }
    }
  }

  subscribe(observer: (state: Accessibility) => void) {
    this.observer.subscribe(observer);
    this.observer.next(this.state);
  }

  unsubscribe() {
    this.observer.unsubscribe();
  }
}
