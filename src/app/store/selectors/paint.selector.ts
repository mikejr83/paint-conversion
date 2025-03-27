import { createSelector } from '@ngrx/store';
import { selectPaintState } from '../reducers';
import { selectAll } from '../reducers/paint.reducer';

export const selectAllPaints = createSelector(selectPaintState, selectAll);

export const selectSelectedPaint = createSelector(
  selectPaintState,
  (state) => state.selectedPaint,
);

export const selectSelectedPaintKey = createSelector(
  selectSelectedPaint,
  (paint) => paint?.key,
);

export const selectSelectedPaintName = createSelector(
  selectSelectedPaint,
  (paint) => paint?.name,
);
