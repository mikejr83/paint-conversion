import { createSelector } from '@ngrx/store';
import { selectPaintState } from '../reducers';
import { Paint } from '@/models/paint';
import {
  selectDefaultPaintsEntities,
  selectDefaultPaintsIds,
  selectUserPaintsEntities,
  selectUserPaintsIds,
} from '../reducers/paint.reducer';

export const selectAllPaints = createSelector(selectPaintState, (state) => {
  const paints: Paint[] = [];
  const defaultPaintsEntities = selectDefaultPaintsEntities(
    state.defaultPaints,
  );
  const defaultPaintsIds = selectDefaultPaintsIds(state.defaultPaints);
  const userPaintEntities = selectUserPaintsEntities(state.userPaints);
  const userPaintIds = selectUserPaintsIds(state.userPaints);

  defaultPaintsIds.forEach((id) => {
    if (userPaintEntities[id]) {
      paints.push(userPaintEntities[id]);
    } else if (defaultPaintsEntities[id]) {
      paints.push(defaultPaintsEntities[id]);
    }
  });

  userPaintIds.forEach((id) => {
    if (!defaultPaintsEntities[id] && userPaintEntities[id]) {
      paints.push(userPaintEntities[id]);
    }
  });

  return paints;
});

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
