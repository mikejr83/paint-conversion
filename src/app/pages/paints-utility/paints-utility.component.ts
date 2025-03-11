import { PaintActions } from '@/app/store/actions/paint.actions';
import { selectAllPaints } from '@/app/store/selectors/paint.selector';
import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-paints-utility',
  imports: [],
  templateUrl: './paints-utility.component.html',
  styleUrl: './paints-utility.component.scss',
})
export class PaintsUtilityComponent implements OnDestroy {
  destroyed = new Subject<void>();

  constructor(store: Store) {
    store
      .select(selectAllPaints)
      .pipe(
        takeUntil(this.destroyed),
        filter((paints) => !paints || paints.length === 0),
      )
      .subscribe(() => {
        store.dispatch(PaintActions.loadPaints());
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
