import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { Store } from '@ngrx/store';

import { PaintsService } from '@/app/services/paints.service';
import {
  selectAllBrands,
  selectCurrentBrand,
} from '@/app/store/selectors/brand.selector';
import { Brand } from '@/models/brand';
import { BrandActions } from '@/app/store/actions/brand.actions';

@Component({
  selector: 'app-filter',
  imports: [MatSelectModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  allBrands;
  selectedBrand;

  constructor(
    private paintsService: PaintsService,
    private store: Store,
  ) {
    this.allBrands = toSignal(store.select(selectAllBrands));
    this.selectedBrand = toSignal(store.select(selectCurrentBrand));
  }

  selectedBrandChanged(changedEvent: MatSelectChange) {
    this.store.dispatch(
      BrandActions.setCurrentBrand({
        brand: (changedEvent.value as Brand).key,
      }),
    );
  }
}
