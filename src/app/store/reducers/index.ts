import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from '@ngrx/store';
import { PaintState } from '../state/paint.state';

import { paintFeatureKey, reducer as paintReducer } from './paint.reducer';
import { isDevMode } from '@angular/core';

export interface State {
  [paintFeatureKey]: PaintState;
}

export const reducers: ActionReducerMap<State> = {
  [paintFeatureKey]: paintReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];

export const selectPaintState =
  createFeatureSelector<PaintState>(paintFeatureKey);
