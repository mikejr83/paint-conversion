import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from '@ngrx/store';
import { PaintComparisonState } from '../state/paint-comparison.state';

import {
  paintComparisonFeatureKey,
  reducer as paintComparisonReducer,
} from './paint-comparison.reducer';
import { isDevMode } from '@angular/core';
import { brandFeatureKey, brandReducer } from './brand.reducer';
import { BrandState } from '../state/brand.state';
import { filterFeatureKey, filterReducer } from './filter.reducer';
import { FilterState } from '../state/filter.state';

export interface State {
  [brandFeatureKey]: BrandState;
  [filterFeatureKey]: FilterState;
  [paintComparisonFeatureKey]: PaintComparisonState;
}

export const reducers: ActionReducerMap<State> = {
  [brandFeatureKey]: brandReducer,
  [filterFeatureKey]: filterReducer,
  [paintComparisonFeatureKey]: paintComparisonReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];

export const selectBrandState =
  createFeatureSelector<BrandState>(brandFeatureKey);
export const selectFilterState =
  createFeatureSelector<FilterState>(filterFeatureKey);
export const selectPaintState = createFeatureSelector<PaintComparisonState>(
  paintComparisonFeatureKey,
);
