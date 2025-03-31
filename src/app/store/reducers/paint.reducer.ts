import { createReducer, on } from '@ngrx/store';
import { PaintActions } from '../actions/paint.actions';
import { Paint } from '@/models/paint';
import { PaintState } from '../state/paint.state';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

export const paintFeatureKey = 'paint';

export const selectId = (paint: Partial<Paint>): string =>
  `${paint.brand}_${paint.series}_${paint.key}`;

export const adapter: EntityAdapter<Paint> = createEntityAdapter<Paint>({
  selectId,
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
  on(PaintActions.reset, (state): PaintState => {
    return {
      ...state,
      ...initialState,
    };
  }),
  on(PaintActions.selectPaint, (state, { paint }) => {
    return {
      ...state,
      selectedPaint: paint,
    };
  }),
  on(PaintActions.updatePaint, (state, { key, paint }) => {
    return adapter.updateOne({ id: key, changes: paint }, state);
  }),
);

export const { selectAll, selectTotal } = adapter.getSelectors();
