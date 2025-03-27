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

@Component({
  selector: 'app-paints-utility',
  imports: [MatTableModule, MatPaginatorModule, PaintsUtilityFilterComponent],
  templateUrl: './paints-utility.component.html',
  styleUrl: './paints-utility.component.scss',
})
export class PaintsUtilityComponent implements AfterViewInit, OnDestroy {
  destroyed = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator = null!;

  dataSource = new MatTableDataSource<Paint>([]);
  brands;

  selection = new SelectionModel<Paint>(false);

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  constructor(
    private dialog: MatDialog,
    private store: Store,
  ) {
    store
      .select(selectAllPaints)
      .pipe(
        takeUntil(this.destroyed),
        filter((paints) => !paints || paints.length === 0),
      )
      .subscribe(() => {
        store.dispatch(PaintActions.loadPaints());
      });

    this.brands = store.selectSignal(selectBrandEntities);

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

  onPaintSelect() {
    this.dialog.open(PaintEditorDialogComponent, {
      disableClose: true,
      height: '600px',
      width: '600px',
    });
  }
}
