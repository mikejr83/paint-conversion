import {
  ApplicationConfig,
  EnvironmentProviders,
  inject,
  isDevMode,
  provideAppInitializer,
  Provider,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideStore, Store } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { reducers, metaReducers } from './store/reducers';
import { provideHttpClient } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { PaintComparisonEffects } from './store/effects/paint-comparison.effects';
import { BrandActions } from './store/actions/brand.actions';
import { BrandEffects } from './store/effects/brand.effects';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { PaintEffects } from './store/effects/paint.effects';
import {
  providePersistStore,
  localStorageStrategy,
} from '@ngrx-addons/persist-state';

const providers: (Provider | EnvironmentProviders)[] = [
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideHttpClient(),
  provideRouter(routes, withComponentInputBinding()),
  provideAnimationsAsync(),
  provideStore(reducers, { metaReducers }),
  providePersistStore<typeof reducers>({
    states: [
      {
        key: 'brand',
        storage: localStorageStrategy,
      },
      {
        key: 'filter',
        storage: localStorageStrategy,
      },
      {
        key: 'paint-comparison',
        storage: localStorageStrategy,
      },
      {
        key: 'paint',
        storage: localStorageStrategy,
      },
    ],
  }),
  provideEffects(BrandEffects, PaintComparisonEffects, PaintEffects),
  provideAppInitializer(() => {
    const store = inject(Store);

    store.dispatch(BrandActions.initializeBrands());
  }),
  {
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue: { appearance: 'outline', subscriptSizing: 'dynamic' },
  },
];

if (isDevMode()) {
  providers.push(provideStoreDevtools({ maxAge: 25, logOnly: false }));
}

export const appConfig: ApplicationConfig = {
  providers,
};
