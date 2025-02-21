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
import { filterFeatureKey, filterReducer } from './filter.reducer';
import { FilterState } from '../state/filter.state';

export interface State {
  [brandFeatureKey]: BrandState;
  [filterFeatureKey]: FilterState;
  [paintFeatureKey]: PaintState;
}

export const reducers: ActionReducerMap<State> = {
  [brandFeatureKey]: brandReducer,
  [filterFeatureKey]: filterReducer,
  [paintFeatureKey]: paintReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];

export const selectBrandState =
  createFeatureSelector<BrandState>(brandFeatureKey);
export const selectFilterState =
  createFeatureSelector<FilterState>(filterFeatureKey);
export const selectPaintState =
  createFeatureSelector<PaintState>(paintFeatureKey);
