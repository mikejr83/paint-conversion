import { createSelector } from '@ngrx/store';
import { selectBrandState, selectFilterState } from '../reducers';
import { adapter } from '../reducers/brand.reducer';

const { selectAll, selectEntities } = adapter.getSelectors();

export const selectAllBrands = createSelector(selectBrandState, selectAll);
export const selectBrandEntities = createSelector(selectBrandState, selectEntities);
