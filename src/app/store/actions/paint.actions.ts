import { BrandData } from '@/models/brand-data';
import { Paint } from '@/models/paint';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const PaintActions = createActionGroup({
  source: 'Paint',
  events: {
    'Add Paint': props<{ paint: Paint; selected: boolean }>(),
    'Load Paints': emptyProps(),
    'Loading Paints': props<{ loading: boolean }>(),
    'Load Paints Complete': props<{
      paintsData: Record<string, BrandData>;
    }>(),
    'Select Paint': props<{ paint: Paint | null }>(),
    'Update Paint': props<{ key: string; paint: Partial<Paint> }>(),
    Reset: emptyProps(),
  },
});
