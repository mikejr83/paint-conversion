import { PaintComparisonCollection } from '@/models/paint';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const PaintComparisonActions = createActionGroup({
  source: 'Paint Comparison',
  events: {
    'Load Paints': props<{ brand: string }>(),
    'Loading Paints': emptyProps(),
    'Load Paints Complete': props<{ brand: string, paintCollection: PaintComparisonCollection }>(),
    'Reset': emptyProps(),
  },
});
