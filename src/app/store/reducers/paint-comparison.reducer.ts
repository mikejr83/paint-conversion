import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { PaintComparisonActions } from '../actions/paint-comparison.actions';
import { PaintComparisonState } from '../state/paint-comparison.state';

import { Paint } from '@/models/paint';

export const paintComparisonFeatureKey = 'paint-comparison';

export const adapter: EntityAdapter<Paint> = createEntityAdapter<Paint>({
  selectId: (paint) => `${paint.brand}_${paint.series}_${paint.name}`,
});

export const initialState: PaintComparisonState = adapter.getInitialState({
  collections: {},
});

export const reducer = createReducer(
  initialState,
  on(
    PaintComparisonActions.loadPaintsComplete,
    (state, { brand, paintCollection }): PaintComparisonState => {
      return {
        ...state,
        collections: {
          ...state.collections,
          [brand]: paintCollection,
        },
      };
    },
  ),
  on(PaintComparisonActions.reset, (state): PaintComparisonState => {
    return {
      ...state,
      ...initialState,
    };
  }),
);
