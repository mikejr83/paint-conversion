import { createReducer, on } from '@ngrx/store';
import { BrandActions } from '../actions/brand.actions';
import { BrandState } from '../state/brand.state';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Brand } from '@/models/brand';

export const brandFeatureKey = 'brand';

export const adapter: EntityAdapter<Brand> = createEntityAdapter<Brand>({
  selectId: (brand: Brand) => brand.key,
});

export const initialState: BrandState = adapter.getInitialState({
  selectedBrand: null,
});

export const brandReducer = createReducer(
  initialState,
  on(BrandActions.loadBrandsComplete, (state, { brands }) => {
    return adapter.setAll(brands, state);
  }),
  on(BrandActions.setCurrentBrand, (state, { brand }): BrandState => {
    return {
      ...state,
      selectedBrand: brand,
    };
  }),
);
