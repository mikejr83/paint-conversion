import { createActionGroup, props } from '@ngrx/store';

export const StatusActions = createActionGroup({
  source: 'Status',
  events: {
    'Set Editing': props<{ editing: boolean }>(),
    'Set Loading': props<{ loading: boolean }>(),
    'Set Processing': props<{ processing: boolean }>(),
  },
});
