import { PaintsService } from '@/app/services/paints.service';
import { selectPaintState } from '@/app/store/reducers';
import {
  selectBrandEntities,
  selectCurrentBrand,
} from '@/app/store/selectors/brand.selector';
import { selectPaintNameFilter } from '@/app/store/selectors/filter.selector';
import { Paint } from '@/models/paint';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatTableModule } from '@angular/material/table';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map } from 'rxjs';

interface PaintRow {
  basePaint: Paint;
  comparedTo: Paint[];
}

@Component({
  selector: 'app-comparison-grid',
  imports: [MatTableModule],
  templateUrl: './comparison-grid.component.html',
  styleUrl: './comparison-grid.component.scss',
})
export class ComparisonGridComponent {
  currentBrand;
  paintRows;
  columns;
  displayedColumns;

  constructor(private paintsService: PaintsService, store: Store) {
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
                  paint.name.indexOf(currentState.paintNameFilter) === -1
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

    this.displayedColumns = toSignal(
      currentState$.pipe(
        map((currentState) => {
          const columns = ['BasePaintInfo', 'BasePaintColor'];
          if (
            currentState.paintCollection &&
            currentState.paintCollection[0]?.length > 1
          ) {
            for (let i = 1; i < currentState.paintCollection[0].length; i++) {
              columns.push(`Comparison${i}`, `Comparison${i}Color`);
            }
          }

          return columns;
        }),
      ),
    );

    this.columns = toSignal(
      currentState$.pipe(
        concatLatestFrom(() => store.select(selectBrandEntities)),
        map(([currentState, brandEntities]) => {
          const columns = [];
          if (
            currentState.paintCollection &&
            currentState.paintCollection[0]?.length > 1
          ) {
            for (let i = 1; i < currentState.paintCollection[0].length; i++) {
              columns.push({
                definition: `Comparison${i}`,
                header:
                  brandEntities[currentState.paintCollection[0][i].brand]?.name,
                paint: (element: PaintRow) => {
                  const index = element.comparedTo.find(
                    (p) =>
                      p.brand.toLocaleLowerCase() ===
                      currentState.paintCollection[0][
                        i
                      ].brand.toLocaleLowerCase(),
                  );
                  return index;
                },
              });
            }
          }

          return columns;
        }),
      ),
    );
  }

  calculateDeltaE(basePaint: Paint, comparisonPaint: Paint) {
    const deltaE = this.paintsService.calculateDeltaE(basePaint!, comparisonPaint);
    return Math.round(deltaE) ;
  }
}
