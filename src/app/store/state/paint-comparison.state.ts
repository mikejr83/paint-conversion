import { Paint, PaintComparisonCollection } from '@/models/paint';
import { EntityState } from '@ngrx/entity';

export interface PaintComparisonState extends EntityState<Paint> {
  collections: Record<string, PaintComparisonCollection>;
}
