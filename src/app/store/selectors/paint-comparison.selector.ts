import { createSelector } from '@ngrx/store';
import { selectPaintComparisonState } from '../reducers';

export const selectPaintsForCurrentBrand = (brand: string) =>
  createSelector(selectPaintComparisonState, (state) => {
    if (brand) {
      return state.collections[brand];
    } else {
      return [];
    }
  });
