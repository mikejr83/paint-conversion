import { createSelector } from '@ngrx/store';
import { selectPaintState } from '../reducers';

export const selectCurrentBrand = createSelector(
  selectPaintState,
  (state) => state.selectedBrand,
);

export const selectPaintsForCurrentBrand = createSelector(
  selectPaintState,
  (state) => {
    if (state.selectedBrand) {
      return state.collections[state.selectedBrand];
    } else {
      return [];
    }
  },
);
