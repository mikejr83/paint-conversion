import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from '@ngrx/store';
import { PaintState } from '../state/paint.state';

import { paintFeatureKey, reducer as paintReducer } from './paint.reducer';
import { isDevMode } from '@angular/core';
import { brandFeatureKey, brandReducer } from './brand.reducer';
import { BrandState } from '../state/brand.state';

export interface State {
  [paintFeatureKey]: PaintState;
  [brandFeatureKey]: BrandState;
}

export const reducers: ActionReducerMap<State> = {
  [brandFeatureKey]: brandReducer,
  [paintFeatureKey]: paintReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];

export const selectBrandState =
  createFeatureSelector<BrandState>(brandFeatureKey);
export const selectPaintState =
  createFeatureSelector<PaintState>(paintFeatureKey);
