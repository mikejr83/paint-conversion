import { createSelector } from '@ngrx/store';
import { selectPaintState } from '../reducers';
import { selectAll } from '../reducers/paint.reducer';

export const selectAllPaints = createSelector(selectPaintState, selectAll);
