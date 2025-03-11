import { createSelector } from '@ngrx/store';
import { selectPaintState } from '../reducers';

export const selectPaintsForCurrentBrand = (brand: string) =>
  createSelector(selectPaintState, (state) => {
    if (brand) {
      return state.collections[brand];
    } else {
      return [];
    }
  });
