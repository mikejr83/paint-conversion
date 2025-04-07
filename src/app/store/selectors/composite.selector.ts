import { createSelector } from '@ngrx/store';
import { selectBrandState, selectFilterState } from '../reducers';
import { selectAllPaints } from './paint.selector';

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

export const selectFilteredPaints = createSelector(
  selectAllPaints,
  selectFilterState,
  (paints, filterState) =>
    paints.filter((p) => {
      let show = true;
      if (filterState.selectedBrand) {
        show = show && p.brand === filterState.selectedBrand;
      }
      if (filterState.paintNameFilter) {
        show = show && p.name.indexOf(filterState.paintNameFilter) >= 0;
      }
      return show;
    }),
);
