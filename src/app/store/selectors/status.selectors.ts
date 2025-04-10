import { createSelector } from '@ngrx/store';
import { selectStatusState } from '../reducers';

export const selectIsEditing = createSelector(
  selectStatusState,
  (state) => state.editing,
);

export const selectIsLoading = createSelector(
  selectStatusState,
  (state) => state.loading,
);

export const selectIsProcessing = createSelector(
  selectStatusState,
  (state) => state.processing,
);
