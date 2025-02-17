import { PaintComparisonCollection } from '@/models/paint';

export interface PaintState {
  collections: { [brand: string]: PaintComparisonCollection };
}
