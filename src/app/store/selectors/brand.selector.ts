import { createSelector } from '@ngrx/store';
import { selectBrandState } from '../reducers';
import { adapter } from '../reducers/brand.reducer';

const { selectAll } = adapter.getSelectors();

export const selectCurrentBrand = createSelector(selectBrandState, (state) => {
  if (state.selectedBrand && state.entities[state.selectedBrand]) {
    return state.entities[state.selectedBrand];
  } else {
    return null;
  }
});

export const selectAllBrands = createSelector(selectBrandState, selectAll);
