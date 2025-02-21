import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { Store } from '@ngrx/store';

import { PaintsService } from '@/app/services/paints.service';
import {
  selectAllBrands,
  selectCurrentBrand,
} from '@/app/store/selectors/brand.selector';
import { Brand } from '@/models/brand';
import { BrandActions } from '@/app/store/actions/brand.actions';
import { combineLatest, debounce, debounceTime, filter, map } from 'rxjs';
import { selectPaintState } from '@/app/store/reducers';
import { Paint } from '@/models/paint';
import { FilterActions } from '@/app/store/actions/filter.actions';

@Component({
  selector: 'app-filter',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  allBrands;
  selectedBrand;

  filterGroup;

  constructor(
    private paintsService: PaintsService,
    private store: Store,
  ) {
    this.allBrands = toSignal(store.select(selectAllBrands));
    this.selectedBrand = toSignal(store.select(selectCurrentBrand));

    const paintNameFilter = new FormControl();
    paintNameFilter.valueChanges.pipe(debounceTime(250)).subscribe((change) => {
      store.dispatch(FilterActions.updatePaintNameFilter({ filter: change }));
    });

    this.filterGroup = new FormGroup({
      paintNameFilter,
    });

    this;
  }

  selectedBrandChanged(changedEvent: MatSelectChange) {
    this.store.dispatch(
      FilterActions.setCurrentBrand({
        brand: (changedEvent.value as Brand).key,
      }),
    );
  }
}
