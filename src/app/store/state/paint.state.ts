import { EntityState } from '@ngrx/entity';

import { Paint } from '@/models/paint';

export interface PaintState extends EntityState<Paint> {
  loading: boolean;
  selectedPaint: Paint | null;
}
