import { EntityState } from '@ngrx/entity';

import { Paint } from '@/models/paint';

export interface PaintState {
  defaultPaints: EntityState<Paint>;
  userPaints: EntityState<Paint>;
  loading: boolean;
  selectedPaint: Paint | null;
}
