import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { filter, Subject, takeUntil } from 'rxjs';

import { PaintsUtilityFilterComponent } from '@/app/components/paints-utility-filter/paints-utility-filter.component';
import { PaintActions } from '@/app/store/actions/paint.actions';
import { selectBrandEntities } from '@/app/store/selectors/brand.selector';
import { selectFilteredPaints } from '@/app/store/selectors/composite.selector';
import { selectAllPaints } from '@/app/store/selectors/paint.selector';
import { Paint } from '@/models/paint';
import { PaintEditorDialogComponent } from '@/app/components/paint-editor-dialog/paint-editor-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { PaintComparisonActions } from '@/app/store/actions/paint-comparison.actions';
import { selectCurrentBrand } from '@/app/store/selectors/filter.selector';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-paints-utility',
  imports: [
    MatButtonModule,
    MatIcon,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    PaintsUtilityFilterComponent,
  ],
  templateUrl: './paints-utility.component.html',
  styleUrl: './paints-utility.component.scss',
})
export class PaintsUtilityComponent implements AfterViewInit, OnDestroy {
  destroyed = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator = null!;

  dataSource = new MatTableDataSource<Paint>([]);
  brands;
  selectedBrand;

  selection = new SelectionModel<Paint>(false);

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  constructor(
    private dialog: MatDialog,
    private store: Store,
  ) {
    // Trigger a load paints action if the control is loaded with no paints in state.
    store
      .select(selectAllPaints)
      .pipe(
        takeUntil(this.destroyed),
        filter((paints) => !paints || paints.length === 0),
      )
      .subscribe(() => {
        store.dispatch(PaintActions.loadPaints());
      });

    // The brands supported by the app.
    this.brands = store.selectSignal(selectBrandEntities);
    // The currently selected brand. This is done via the filter.
    this.selectedBrand = store.selectSignal(selectCurrentBrand);

    this.selection.changed
      .pipe(takeUntil(this.destroyed))
      .subscribe((changed) => {
        if (changed.added.length === 1) {
          store.dispatch(PaintActions.selectPaint({ paint: changed.added[0] }));
        } else {
          store.dispatch(PaintActions.selectPaint({ paint: null }));
        }
      });
  }

  ngAfterViewInit(): void {
    this.store
      .select(selectFilteredPaints)
      .pipe(takeUntil(this.destroyed))
      .subscribe((paints) => {
        this.dataSource.data = paints;
        this.dataSource.paginator = this.paginator;
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  onPaintAdd() {
    const selectedBrand = this.selectedBrand();
    this.store.dispatch(PaintActions.addPaint({
      paint: {
        brand: selectedBrand!,
        key: 'NEW_PAINT',
        name: 'New Paint',
        series: 'Series',
        color: '#000000',
        userAdded: true,
      },
      selected: true,
    }))
    this.dialog.open(PaintEditorDialogComponent, {
      disableClose: true,
      height: '600px',
      width: '600px',
    });
  }

  onPaintSelect() {
    this.dialog.open(PaintEditorDialogComponent, {
      disableClose: true,
      height: '600px',
      width: '600px',
    });
  }

  onReset() {
    this.store.dispatch(PaintActions.reset());
    this.store.dispatch(PaintComparisonActions.reset());
  }
}
