import { Component, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PaintsService } from './services/paints.service';
import { Store } from '@ngrx/store';
import { PaintActions } from './store/actions/paint.actions';
import { ComparisonGridComponent } from './components/comparison-grid/comparison-grid.component';
import { selectPaintsForCurrentBrand } from './store/selectors/paint.selector';

@Component({
  selector: 'app-root',
  imports: [ComparisonGridComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'paint-conversion';

  paintComparisonCollection;

  constructor(
    private paintsService: PaintsService,
    private store: Store,
  ) {
    this.paintComparisonCollection = toSignal(
      store.select(selectPaintsForCurrentBrand),
    );
  }

  ngOnInit(): void {
    this.store.dispatch(PaintActions.loadPaints({ brand: 'citadel' }));
  }
}
