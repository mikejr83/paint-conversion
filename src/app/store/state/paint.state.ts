import { PaintComparisonCollection } from '@/models/paint';

export interface PaintState {
  selectedBrand: string | null;
  collections: { [brand: string]: PaintComparisonCollection };
}
