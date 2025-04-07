import { createReducer, on } from '@ngrx/store';
import { PaintActions } from '../actions/paint.actions';
import { Paint } from '@/models/paint';
import { PaintState } from '../state/paint.state';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

export const paintFeatureKey = 'paint';

export const selectId = (paint: Partial<Paint>): string =>
  `${paint.brand}_${paint.series}_${paint.key}`;

const defaultPaintsAdapter: EntityAdapter<Paint> = createEntityAdapter<Paint>({
  selectId,
});
const userPaintsAdapter: EntityAdapter<Paint> = createEntityAdapter<Paint>({
  selectId,
});

export const initialState: PaintState = {
  defaultPaints: defaultPaintsAdapter.getInitialState(),
  userPaints: userPaintsAdapter.getInitialState(),
  loading: false,
  selectedPaint: null,
};

export const reducer = createReducer(
  initialState,
  on(PaintActions.addPaint, (state, { paint, selected }): PaintState => {
    const userPaintsState = userPaintsAdapter.addOne(paint, state.userPaints);
    return {
      ...state,
      userPaints: userPaintsState,
      selectedPaint: selected ? paint : state.selectedPaint,
    };
  }),
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

    const defaultPaintsState = defaultPaintsAdapter.upsertMany(
      paints,
      state.defaultPaints,
    );

    return {
      ...state,
      defaultPaints: defaultPaintsState,
    };
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
  on(PaintActions.updatePaint, (state, { paint }) => {
    const userPaintsState = userPaintsAdapter.upsertOne(
      paint,
      state.userPaints,
    );
    return {
      ...state,
      userPaints: userPaintsState,
    };
  }),
);

export const {
  selectAll: selectAllDefaultPaints,
  selectIds: selectDefaultPaintsIds,
  selectEntities: selectDefaultPaintsEntities,
  selectTotal: selectTotalDefaultPaints,
} = defaultPaintsAdapter.getSelectors();
export const {
  selectAll: selectAllUserPaints,
  selectIds: selectUserPaintsIds,
  selectEntities: selectUserPaintsEntities,
  selectTotal: selectTotalUserPaints,
} = userPaintsAdapter.getSelectors();
