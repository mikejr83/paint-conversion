import { selectPaintState } from '@/app/store/reducers';
import { selectCurrentBrand } from '@/app/store/selectors/brand.selector';
import { Paint, PaintComparisonCollection } from '@/models/paint';
import { Component, computed, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatTableModule } from '@angular/material/table';
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
  paintRows;
  columns;
  displayedColumns;

  constructor(store: Store) {
    const currentState$ = combineLatest([
      store.select(selectCurrentBrand),
      store.select(selectPaintState),
    ]).pipe(
      filter(([brand, paintState]) => !!brand && !!paintState.collections),
      map(([brand, paintState]) => {
        return { brand, paintCollection: paintState.collections[brand!.key] };
      }),
    );

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
                currentState.brand!.name.toLocaleLowerCase()
              ) {
                paintRow = {
                  basePaint: paint,
                  comparedTo: [],
                };
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

          console.log('displayColumns', columns);

          return columns;
        }),
      ),
    );

    this.columns = toSignal(
      currentState$.pipe(
        map((currentState) => {
          const columns = [];
          if (
            currentState.paintCollection &&
            currentState.paintCollection[0]?.length > 1
          ) {
            for (let i = 1; i < currentState.paintCollection[0].length; i++) {
              columns.push({
                definition: `Comparison${i}`,
                header: currentState.paintCollection[0][i].brand,
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
          console.log('columns', columns);
          return columns;
        }),
      ),
    );
  }
}
