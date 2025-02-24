import { createSelector } from '@ngrx/store';
import { selectBrandState, selectFilterState } from '../reducers';
import { adapter } from '../reducers/brand.reducer';

const { selectAll, selectEntities } = adapter.getSelectors();

export const selectCurrentBrand = createSelector(
  selectBrandState,
  selectFilterState,
  (brandState, filterState) => {
    if (
      filterState.selectedBrand &&
      brandState.entities &&
      brandState.entities[filterState.selectedBrand]
    ) {
      return brandState.entities[filterState.selectedBrand];
    } else {
      return null;
    }
  },
);

export const selectAllBrands = createSelector(selectBrandState, selectAll);
export const selectBrandEntities = createSelector(selectBrandState, selectEntities);
