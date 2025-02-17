import { Brand } from '@/models/brand';
import { EntityState } from '@ngrx/entity';

export interface BrandState extends EntityState<Brand> {
  selectedBrand: string | null;
}
