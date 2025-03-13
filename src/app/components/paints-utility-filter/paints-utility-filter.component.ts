import { FilterActions } from '@/app/store/actions/filter.actions';
import { selectAllBrands } from '@/app/store/selectors/brand.selector';
import { selectCurrentBrand } from '@/app/store/selectors/composite.selector';
import { Brand } from '@/models/brand';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-paints-utility-filter',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './paints-utility-filter.component.html',
  styleUrl: './paints-utility-filter.component.scss',
})
export class PaintsUtilityFilterComponent {
  selectedBrand;
  brands;

  filterGroup;

  constructor(private store: Store) {
    this.selectedBrand = store.selectSignal(selectCurrentBrand);
    this.brands = store.selectSignal(selectAllBrands);

    const paintNameFilter = new FormControl();
    paintNameFilter.valueChanges.pipe(debounceTime(250)).subscribe((change) => {
      store.dispatch(FilterActions.updatePaintNameFilter({ filter: change }));
    });

    this.filterGroup = new FormGroup({
      paintNameFilter,
    });
  }

  selectedBrandChanged(changedEvent: MatSelectChange) {
    const brand = changedEvent.value as Brand;
    this.store.dispatch(
      FilterActions.setCurrentBrand({
        brand: brand.key,
      }),
    );
  }
}
