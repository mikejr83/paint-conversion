import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter, Subject, takeUntil } from 'rxjs';

import { PaintEditorDialogComponent } from '@/app/components/paint-editor-dialog/paint-editor-dialog.component';
import { PaintsUtilityFilterComponent } from '@/app/components/paints-utility-filter/paints-utility-filter.component';

import { PaintActions } from '@/app/store/actions/paint.actions';

import { selectBrandEntities } from '@/app/store/selectors/brand.selector';
import { selectFilteredPaints } from '@/app/store/selectors/composite.selector';
import { selectCurrentBrand } from '@/app/store/selectors/filter.selector';
import {
  selectAllPaints,
  selectHasCustomizedPaint,
} from '@/app/store/selectors/paint.selector';
import { selectIsProcessing } from '@/app/store/selectors/status.selectors';

import { Paint } from '@/models/paint';

@Component({
  selector: 'app-paints-utility',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIcon,
    MatProgressSpinnerModule,
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
  hasCustomizedPaint;
  isProcessing;
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
        distinctUntilChanged((pre, cur) => pre.length === cur.length),
      )
      .subscribe(() => {
        store.dispatch(PaintActions.loadPaints());
      });

    // The brands supported by the app.
    this.brands = store.selectSignal(selectBrandEntities);
    this.hasCustomizedPaint = store.selectSignal(selectHasCustomizedPaint);
    this.isProcessing = store.selectSignal(selectIsProcessing);
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
    const newPaints = this.dataSource.data.filter((p) =>
      p.key.startsWith('NEW_PAINT'),
    ).length;

    const selectedBrand = this.selectedBrand();
    const newPaint: Paint = {
      brand: selectedBrand!,
      key: newPaints > 0 ? `NEW_PAINT_${newPaints + 1}` : 'NEW_PAINT',
      name: 'New Paint',
      series: 'Series',
      color: `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
        .toLocaleUpperCase()}`,
      userAdded: true,
    };

    this.dialog.open(PaintEditorDialogComponent, {
      disableClose: true,
      height: '600px',
      width: '600px',
      data: { ...newPaint, isNew: true },
    });
  }

  onPaintSelect(paint: Paint) {
    this.dialog.open(PaintEditorDialogComponent, {
      disableClose: true,
      height: '600px',
      width: '600px',
      data: { ...paint, isNew: false },
    });
  }

  onReset() {
    this.store.dispatch(PaintActions.reset());
  }
}
