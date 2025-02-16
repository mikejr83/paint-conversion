import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { PaintActions } from '../actions/paint.actions';
import { PaintState } from '../state/paint.state';

import { Paint } from '@/models/paint';

export const paintFeatureKey = 'paint';

export const adapter: EntityAdapter<Paint> = createEntityAdapter<Paint>({
  selectId: (paint) => `${paint.brand}_${paint.series}_${paint.name}`,
});

export const initialState: PaintState = {
  collections: {},
  selectedBrand: null,
};

export const reducer = createReducer(
  initialState,
  on(PaintActions.loadPaints, (state, { brand }): PaintState => {
    return {
      ...state,
      selectedBrand: brand,
    };
  }),
  on(
    PaintActions.loadPaintsComplete,
    (state, { brand, paintCollection }): PaintState => {
      return {
        ...state,
        collections: {
          ...state.collections,
          [brand]: paintCollection,
        },
      };
    },
  ),
);
