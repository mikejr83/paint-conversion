import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FilterActions = createActionGroup({
  source: 'Brand',
  events: {
    'Clear Name Filters': emptyProps(),
    'Update Paint Name Filter': props<{ filter: string }>(),
    'Set Current Brand': props<{ brand: string }>(),
  },
});
