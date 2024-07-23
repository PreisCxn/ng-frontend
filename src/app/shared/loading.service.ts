import {Injectable, Renderer2} from '@angular/core';
import {NavigationEnd, NavigationStart} from "@angular/router";
import {Optional} from "./optional";
import {CallToActionServiceService} from "./call-to-action-service.service";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  static readonly dalyUntilLoadScreen: number = 300;

  static promises: Promise<any>[] = [];

  isLoading: boolean = true;

  loadingScreenActive: boolean = true;

  loadingScreen: HTMLElement | null = null;

  private startTime: number | null = Date.now();

  private renderer: Optional<Renderer2> = Optional.empty();

  private init: boolean = false;

  constructor() { }

  onNavigationStart(event: NavigationStart | null, renderer: Renderer2 | null) {
    if(renderer)
      this.renderer = Optional.of(renderer);
    if(this.renderer.isEmpty()) return;
    if(!this.getLoadingScreen()) return;

    this.isLoading = true;
    setTimeout(() => {
      if(this.isLoading)
        this.activateLoadingScreen();
    }, LoadingService.dalyUntilLoadScreen);
  }

  async onNavigationEnd(event: NavigationEnd | null, renderer: Renderer2 | null, force: boolean = false): Promise<void> {
    if(renderer)
      this.renderer = Optional.of(renderer);

    if(this.renderer.isEmpty()) return;

      this.isLoading = false;

      if (!this.getLoadingScreen()) return;

      if (this.loadingScreenActive )
        this.deactivateLoadingScreen();

  }

  onNavigationFail() {
    this.onNavigationEnd(null, null).then(r => {})
  }

  private activateLoadingScreen() {
    if(!this.getLoadingScreen()) return;
    if(this.renderer.isEmpty()) return;
    this.loadingScreenActive = true;

    this.startTime = Date.now();

    const render = this.renderer.get();

    if(this.init) {

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
  }

  private deactivateLoadingScreen() {
    this.init = true;
    this.loadingScreenActive = false;

    if(!this.getLoadingScreen()) return;
    if(this.renderer.isEmpty()) return;

    const renderer = this.renderer.get();

    let bool = false;

    if(this.startTime != null) {
      bool = Date.now() - this.startTime > 1500;
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

  isInit(): boolean {
    return this.init;
  }

}
