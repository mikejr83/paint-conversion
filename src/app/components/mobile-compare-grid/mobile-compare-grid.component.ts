import { PaintsService } from '@/app/services/paints.service';
import { selectPaintState } from '@/app/store/reducers';
import { selectCurrentBrand } from '@/app/store/selectors/brand.selector';
import { selectPaintNameFilter } from '@/app/store/selectors/filter.selector';
import { Paint } from '@/models/paint';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map } from 'rxjs';

interface PaintRow {
  basePaint: Paint;
  comparedTo: Paint[];
}

@Component({
  selector: 'app-mobile-compare-grid',
  imports: [MatTooltipModule],
  templateUrl: './mobile-compare-grid.component.html',
  styleUrl: './mobile-compare-grid.component.scss',
})
export class MobileCompareGridComponent {
  currentBrand;
  paintRows;

  constructor(
    private paintsService: PaintsService,
    store: Store,
  ) {
    const currentState$ = combineLatest([
      store.select(selectCurrentBrand),
      store.select(selectPaintState),
      store.select(selectPaintNameFilter),
    ]).pipe(
      filter(([brand, paintState]) => !!brand && !!paintState.collections),
      map(([brand, paintState, paintNameFilter]) => {
        return {
          brand,
          paintCollection: paintState.collections[brand!.key],
          paintNameFilter,
        };
      }),
    );

    this.currentBrand = toSignal(store.select(selectCurrentBrand));

    this.paintRows = toSignal(
      currentState$.pipe(
        filter(
          (currentState) =>
            !!currentState.brand && !!currentState.paintCollection,
        ),
        map((currentState) => {
          const rows: PaintRow[] = [];
          currentState.paintCollection.forEach((comparisonSet) => {
            const comparedTo: Paint[] = [];
            let paintRow: PaintRow | undefined;

            comparisonSet.forEach((paint) => {
              if (
                paint.brand.toLocaleLowerCase() ===
                currentState.brand!.key.toLocaleLowerCase()
              ) {
                if (
                  currentState.paintNameFilter &&
                  paint.name
                    .toLocaleLowerCase()
                    .indexOf(
                      currentState.paintNameFilter.toLocaleLowerCase(),
                    ) === -1
                ) {
                  return;
                } else {
                  paintRow = {
                    basePaint: paint,
                    comparedTo: [],
                  };
                }
              } else {
                comparedTo.push(paint);
              }
            });

            if (paintRow !== undefined) {
              paintRow.comparedTo = comparedTo;
              rows.push(paintRow);
            }
          });

          return rows;
        }),
      ),
    );
  }
}
