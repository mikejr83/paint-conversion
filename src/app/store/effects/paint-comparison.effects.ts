import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { filter, map, switchMap } from 'rxjs';

import { PaintsService } from '@/app/services/paints.service';
import { PaintComparisonActions } from '../actions/paint-comparison.actions';
import { selectCurrentBrand } from '../selectors/composite.selector';
import { selectBrandState, selectPaintComparisonState } from '../reducers';

@Injectable()
export class PaintComparisonEffects {
  loadPaints$;
  reset$;
  selectedBrandChanged$;
  constructor(actions$: Actions, store: Store, paintsService: PaintsService) {
    this.loadPaints$ = createEffect(() => {
      return actions$.pipe(
        ofType(PaintComparisonActions.loadPaints),
        filter((action) => !!action.brand),
        concatLatestFrom(() => store.select(selectBrandState)),
        map(([action, brandState]) => {
          if (
            action.brand &&
            brandState.ids.length > 0 &&
            brandState.entities &&
            brandState.entities[action.brand]
          ) {
            return brandState.entities[action.brand];
          } else {
            return null;
          }
        }),
        filter((brand) => !!brand),
        switchMap((brand) => {
          return paintsService.loadPaintsByFilename(brand!.filename).pipe(
            map((paintCollection) => {
              return { brand, paintCollection };
            }),
          );
        }),
        map((result) => {
          return PaintComparisonActions.loadPaintsComplete({
            brand: result.brand!.key,
            paintCollection: result.paintCollection,
          });
        }),
      );
    });

    this.reset$ = createEffect(() => {
      return actions$.pipe(
        ofType(PaintComparisonActions.reset),
        concatLatestFrom(() => [
          store.select(selectCurrentBrand),
          store.select(selectBrandState),
        ]),
        filter(([_action, currentBrand, _brandState]) => !!currentBrand),
        map(([_action, currentBrand, brandState]) => {
          if (
            brandState.ids.length > 0 &&
            brandState.entities &&
            brandState.entities[currentBrand!.key]
          ) {
            return brandState.entities[currentBrand!.key];
          } else {
            return null;
          }
        }),
        filter((brand) => !!brand),
        switchMap((brand) => {
          return paintsService.loadPaintsByFilename(brand!.filename).pipe(
            map((paintCollection) => {
              return { brand, paintCollection };
            }),
          );
        }),
        map((result) => {
          return PaintComparisonActions.loadPaintsComplete({
            brand: result.brand!.key,
            paintCollection: result.paintCollection,
          });
        }),
      );
    });

    this.selectedBrandChanged$ = createEffect(() => {
      return store.select(selectCurrentBrand).pipe(
        filter((brand) => !!brand),
        concatLatestFrom(() => store.select(selectPaintComparisonState)),
        filter(([brand, paintState]) => !paintState.collections[brand!.key]),
        map(([brand]) => {
          return PaintComparisonActions.loadPaints({
            brand: brand!.key,
          });
        }),
      );
    });
  }
}
