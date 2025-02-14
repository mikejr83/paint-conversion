import {
  ApplicationConfig,
  EnvironmentProviders,
  isDevMode,
  Provider,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import environment from '@/environment';
import { reducers, metaReducers } from './store/reducers';
import { provideHttpClient } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { PaintEffects } from './store/effects/paint.effects';

const providers: (Provider | EnvironmentProviders)[] = [
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideHttpClient(),
  provideRouter(routes),
  provideAnimationsAsync(),
  provideStore(reducers, { metaReducers }),
  provideEffects(PaintEffects),
];

if (isDevMode()) {
  providers.push(provideStoreDevtools({ maxAge: 25, logOnly: false }));
}

export const appConfig: ApplicationConfig = {
  providers,
};
