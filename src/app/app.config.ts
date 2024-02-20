import {ApplicationConfig, importProvidersFrom, isDevMode} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import {HttpClient, HttpClientModule} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(
      HttpClientModule
    ),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
]
};
