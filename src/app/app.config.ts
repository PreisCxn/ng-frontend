import {ApplicationConfig, importProvidersFrom, isDevMode} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import {HttpClientModule} from "@angular/common/http";
import {provideToastr, ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgcCookieConsentConfig, NgcCookieConsentModule, provideNgcCookieConsent} from "ngx-cookieconsent";

export const cookieConfig:NgcCookieConsentConfig = {
  cookie: {
    domain: 'preiscxn.de'
  },
  palette: {
    popup: {
      background: 'rgba(0,0,0,0.7)'
    },
    button: {
      background: '#ec9813'
    }
  },
  theme: 'edgeless',
  type: 'info'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideToastr(),
    provideClientHydration(),
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule,
      NgcCookieConsentModule.forRoot(cookieConfig)
    ),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
]
};
