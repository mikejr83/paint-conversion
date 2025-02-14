import { Paint, PaintComparisonCollection } from '@/models/paint';
import { Component, computed, input } from '@angular/core';

import { MatTableModule } from '@angular/material/table';

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
  brand = input<string>('citadel');
  paintComparisonCollection = input<PaintComparisonCollection>([]);

  paintRows;
  columns;
  displayedColumns;

  constructor() {
    this.paintRows = computed(() => {
      const brand = this.brand();
      const collection = this.paintComparisonCollection();
      const rows: PaintRow[] = [];
      collection.forEach((comparisonSet) => {
        const comparedTo: Paint[] = [];
        let paintRow: PaintRow | undefined;

        comparisonSet.forEach((paint) => {
          if (paint.brand.toLocaleLowerCase() === brand.toLocaleLowerCase()) {
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
    });

    this.displayedColumns = computed(() => {
      const collection = this.paintComparisonCollection();
      const columns = ['BasePaintInfo', 'BasePaintColor'];
      if (collection && collection[0]?.length > 1) {
        for (let i = 1; i < collection[0].length; i++) {
          columns.push(`Comparison${i}`, `Comparison${i}Color`);
        }
      }

      console.log('displayColumns', columns);

      return columns;
    });

    this.columns = computed(() => {
      const collection = this.paintComparisonCollection();
      const columns = [];
      if (collection && collection[0]?.length > 1) {
        for (let i = 1; i < collection[0].length; i++) {
          columns.push({
            definition: `Comparison${i}`,
            header: collection[0][i].brand,
            paint: (element: PaintRow) => {
              const index = element.comparedTo.find(
                (p) =>
                  p.brand.toLocaleLowerCase() ===
                  collection[0][i].brand.toLocaleLowerCase(),
              );
              return index;
            },
          });
        }
      }
      console.log('columns', columns);
      return columns;
    });
  }
}
