import { createReducer, on } from '@ngrx/store';
import { FilterActions } from '../actions/filter.actions';
import { FilterState } from '../state/filter.state';

export const filterFeatureKey = 'filter';

export const initialState: FilterState = {
  paintNameFilter: null,
  selectedBrand: null,
  seriesNameFilter: null,
};

export const filterReducer = createReducer(
  initialState,
  on(FilterActions.clearNameFilters, (state): FilterState => {
    return {
      ...state,
      paintNameFilter: null,
      seriesNameFilter: null,
    };
  }),
  on(FilterActions.setCurrentBrand, (state, { brand }): FilterState => {
    return {
      ...state,
      selectedBrand: brand,
    };
  }),
  on(FilterActions.updatePaintNameFilter, (state, { filter }): FilterState => {
    return {
      ...state,
      paintNameFilter: filter,
    };
  }),
);
