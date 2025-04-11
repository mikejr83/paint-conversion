import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';

import { PaintsService } from '@/app/services/paints.service';
import { PaintActions } from '../actions/paint.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatLatestFrom } from '@ngrx/operators';
import { selectAllPaints } from '../selectors/paint.selector';

@Injectable()
export class PaintEffects {
  loadingPaints$;
  loadingPaintsComplete$;
  loadPaints$;

  paintEdited$;
  constructor(actions$: Actions, store: Store, paintsService: PaintsService) {
    this.loadingPaints$ = createEffect(() => {
      return actions$.pipe(
        ofType(PaintActions.loadPaints),
        map(() => PaintActions.loadingPaints({ loading: true })),
      );
    });

    this.loadPaints$ = createEffect(() => {
      return actions$.pipe(
        ofType(PaintActions.loadPaints),
        switchMap(() => paintsService.loadAllPaints()),
        map((result) => {
          return PaintActions.loadPaintsComplete({
            paintsData: result,
          });
        }),
      );
    });

    this.loadingPaintsComplete$ = createEffect(() => {
      return actions$.pipe(
        ofType(PaintActions.loadPaintsComplete),
        map(() => PaintActions.loadingPaints({ loading: false })),
      );
    });

    this.paintEdited$ = actions$
      .pipe(
        takeUntilDestroyed(),
        ofType(PaintActions.updatePaint, PaintActions.removePaint),
        concatLatestFrom(() => store.select(selectAllPaints)),
      )
      .subscribe(([_action, paints]) => {
        paintsService.compareAllPaints(paints);
      });
  }
}
