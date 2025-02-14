import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { selectCurrentBrand } from '../selectors/paint.selector';
import { filter, map, switchMap } from 'rxjs';
import { PaintsService } from '@/app/services/paints.service';
import { PaintActions } from '../actions/paint.actions';

@Injectable()
export class PaintEffects {
  selectedBrandChanged$;
  constructor(actions$: Actions, store: Store, paintsService: PaintsService) {
    this.selectedBrandChanged$ = createEffect(() => {
      return store.select(selectCurrentBrand).pipe(
        filter((brand) => !!brand),
        switchMap((brand) => {
          return paintsService.loadPaints(brand!).pipe(
            map((paintCollection) => {
              return { brand, paintCollection };
            }),
          );
        }),
        map((result) => {
          return PaintActions.loadPaintsComplete({
            brand: result.brand!,
            paintCollection: result.paintCollection,
          });
        }),
      );
    });
  }
}
