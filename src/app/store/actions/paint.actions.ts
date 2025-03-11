import { BrandData } from '@/models/brand-data';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const PaintActions = createActionGroup({
  source: 'Paint',
  events: {
    'Load Paints': emptyProps(),
    'Loading Paints': props<{ loading: boolean }>(),
    'Load Paints Complete': props<{
      paintsData: Record<string, BrandData>;
    }>(),
  },
});
