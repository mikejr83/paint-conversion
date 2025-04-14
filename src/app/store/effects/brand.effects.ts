import { BrandsService } from '@/app/services/brands.service';
import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { filter, map, switchMap } from 'rxjs';

import { BrandActions } from '../actions/brand.actions';
import { selectAllBrands } from '../selectors/brand.selector';

@Injectable({
  providedIn: 'root',
})
export class BrandEffects {
  initializeBrands$;
  loadBrands$;
  loadBrandsComplete$;

  constructor(actions$: Actions, store: Store, brandsService: BrandsService) {
    this.initializeBrands$ = createEffect(() => {
      return actions$.pipe(
        ofType(BrandActions.initializeBrands),
        concatLatestFrom(() => store.select(selectAllBrands)),
        filter(([_action, brands]) => brands.length === 0),
        map(() => BrandActions.loadBrands()),
      );
    });

    this.loadBrands$ = createEffect(() => {
      return actions$.pipe(
        ofType(BrandActions.loadBrands),
        switchMap(() => {
          return brandsService.loadBrands();
        }),
        map((brands) => {
          return BrandActions.loadBrandsComplete({ brands });
        }),
      );
    });

    this.loadBrandsComplete$ = createEffect(() => {
      return actions$.pipe(
        ofType(BrandActions.loadBrandsComplete),
        concatLatestFrom(() => store.select(selectAllBrands)),
        map(([_action, brands]) => {
          return BrandActions.setCurrentBrand({ brand: brands[0].key });
        }),
      );
    });
  }
}
