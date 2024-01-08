import {Injectable, Renderer2} from '@angular/core';
import {NavigationEnd, NavigationStart} from "@angular/router";
import {Optional} from "./optional";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  static readonly dalyUntilLoadScreen: number = 300;

  isLoading: boolean = false;

  loadingScreenActive: boolean = false;

  loadingScreen: HTMLElement | null = null;

  private startTime: number | null = null;

  private renderer: Optional<Renderer2> = Optional.empty();

  constructor() { }

  onNavigationStart(event: NavigationStart, renderer: Renderer2) {
    this.renderer = Optional.of(renderer);
    if(this.renderer.isEmpty()) return;
    if(!this.getLoadingScreen()) return;

    this.isLoading = true;
    setTimeout(() => {
      if(this.isLoading)
        this.activateLoadingScreen();
    }, LoadingService.dalyUntilLoadScreen);
  }

  onNavigationEnd(event: NavigationEnd, renderer: Renderer2) {
    this.renderer = Optional.of(renderer);
    if(this.renderer.isEmpty()) return;
    this.isLoading = false;

    if(!this.getLoadingScreen()) return;

    if(this.loadingScreenActive)
      this.deactivateLoadingScreen();
  }

  private activateLoadingScreen() {
    console.log("activateLoadingScreen")
    if(!this.getLoadingScreen()) return;
    if(this.renderer.isEmpty()) return;
    this.loadingScreenActive = true;

    this.startTime = Date.now();

    const render = this.renderer.get();

    render.addClass(document.body, 'no-transition');
    render.removeClass(this.loadingScreen, 'transition');
    setTimeout(() => {
      render.addClass(this.loadingScreen, 'hideOc');
      setTimeout(() => {
        render.removeClass(this.loadingScreen, 'hide');
        setTimeout(() => {
          render.removeClass(this.loadingScreen, 'hideOc');
        }, 100);
      }, 100);
    }, 100);

  }

  private deactivateLoadingScreen() {
    console.log("deactivateLoadingScreen")
    this.loadingScreenActive = false;

    if(!this.getLoadingScreen()) return;
    if(this.renderer.isEmpty()) return;

    const renderer = this.renderer.get();

    let bool = false;

    if(this.startTime != null) {
      bool = Date.now() - this.startTime > 2000;
      console.log(Date.now() - this.startTime)
    }



    if (bool) {
      renderer.addClass(this.loadingScreen, 'transition');
    }

    setTimeout(() => {
      if(!this.renderer) return;
      if (bool) {
        renderer.addClass(this.loadingScreen, 'hide');
      } else {
        renderer.addClass(this.loadingScreen, 'hideOc');
        setTimeout(() => {
          if(!this.renderer) return;
          renderer.addClass(this.loadingScreen, 'hide');
        }, 400);
      }
      setTimeout(() => {
        if(!this.renderer) return;
        renderer.removeClass(document.body, 'no-transition');
      }, 10);
    }, 10);

  }

  getLoadingScreen(): boolean {
    if(!this.loadingScreen)
      this.loadingScreen = document.getElementById('loading-screen');

    return this.loadingScreen !== null;
  }

}
