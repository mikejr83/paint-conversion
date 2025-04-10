import { createReducer, on } from '@ngrx/store';
import { StatusActions } from '../actions/status.actions';
import { StatusState } from '../state/status.state';

export const statusFeatureKey = 'status';

export const initialState: StatusState = {
  editing: false,
  loading: false,
  processing: false,
};

export const statusReducer = createReducer(
  initialState,
  on(StatusActions.setEditing, (state, { editing }): StatusState => {
    return {
      ...state,
      editing,
    };
  }),
  on(StatusActions.setLoading, (state, { loading }): StatusState => {
    return {
      ...state,
      loading,
    };
  }),
  on(StatusActions.setProcessing, (state, { processing }): StatusState => {
    return {
      ...state,
      processing,
    };
  }),
);
