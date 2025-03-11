import { createReducer, on } from '@ngrx/store';
import { PaintActions } from '../actions/paint.actions';
import { Paint } from '@/models/paint';
import { PaintState } from '../state/paint.state';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

export const paintFeatureKey = 'paint';

export const adapter: EntityAdapter<Paint> = createEntityAdapter<Paint>({
  selectId: (paint) => `${paint.brand}_${paint.series}_${paint.name}`,
});

export const initialState: PaintState = adapter.getInitialState({
  loading: false,
  selectedPaint: null,
});

export const reducer = createReducer(
  initialState,
  on(PaintActions.loadingPaints, (state, { loading }): PaintState => {
    return {
      ...state,
      loading,
    };
  }),
  on(PaintActions.loadPaintsComplete, (state, { paintsData }) => {
    const paints: Paint[] = [];

    Object.getOwnPropertyNames(paintsData).forEach((brandKey) => {
      const brand = paintsData[brandKey];
      Object.getOwnPropertyNames(brand.paintMap).forEach((paintKey) => {
        paints.push(brand.paintMap[paintKey]);
      });
    });

    return adapter.upsertMany(paints, state);
  }),
);

export const { selectAll, selectTotal } = adapter.getSelectors();
