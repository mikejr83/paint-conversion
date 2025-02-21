import { createSelector } from '@ngrx/store';
import { selectFilterState } from '../reducers';

export const selectCurrentBrand = createSelector(
  selectFilterState,
  (state) => state.selectedBrand,
);

export const selectPaintNameFilter = createSelector(
  selectFilterState,
  (state) => state.paintNameFilter,
);
