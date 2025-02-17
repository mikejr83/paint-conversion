import {
  ApplicationConfig,
  EnvironmentProviders,
  inject,
  isDevMode,
  provideAppInitializer,
  Provider,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideStore, Store } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { reducers, metaReducers } from './store/reducers';
import { provideHttpClient } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { PaintEffects } from './store/effects/paint.effects';
import { BrandActions } from './store/actions/brand.actions';
import { BrandEffects } from './store/effects/brand.effects';

const providers: (Provider | EnvironmentProviders)[] = [
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideHttpClient(),
  provideRouter(routes),
  provideAnimationsAsync(),
  provideStore(reducers, { metaReducers }),
  provideEffects(BrandEffects, PaintEffects),
  provideAppInitializer(() => {
    const store = inject(Store);

    store.dispatch(BrandActions.loadBrands());
  },)
];

if (isDevMode()) {
  providers.push(provideStoreDevtools({ maxAge: 25, logOnly: false }));
}

export const appConfig: ApplicationConfig = {
  providers,
};
