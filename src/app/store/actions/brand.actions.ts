import { Brand } from '@/models/brand';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const BrandActions = createActionGroup({
  source: 'Brand',
  events: {
    'Load Brands': emptyProps(),
    'Load Brands Complete': props<{ brands: Brand[] }>(),
    'Set Current Brand': props<{ brand: string }>(),
  },
});
