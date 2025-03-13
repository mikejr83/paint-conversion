import { PaintsUtilityFilterComponent } from '@/app/components/paints-utility-filter/paints-utility-filter.component';
import { PaintActions } from '@/app/store/actions/paint.actions';
import { selectBrandEntities } from '@/app/store/selectors/brand.selector';
import { selectFilteredPaints } from '@/app/store/selectors/composite.selector';
import { selectAllPaints } from '@/app/store/selectors/paint.selector';
import { Paint } from '@/models/paint';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { filter, Subject, takeUntil } from 'rxjs';

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

  constructor(private store: Store) {
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
}
