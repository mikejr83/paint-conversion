import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy } from '@angular/core';

import { Paint, PaintComparisonCollection } from '@/models/paint';
import { BrandData } from '@/models/brand-data';
import { Store } from '@ngrx/store';
import { PaintComparisonActions } from '../store/actions/paint-comparison.actions';
import { PAINT_ANALYZER_WOKER_FACTORY } from './injectable-tokens';
import { StatusActions } from '../store/actions/status.actions';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class PaintsService implements OnDestroy {
  private paintAnalyzer: Worker | null = null;
  private paintAnalyzerMessages = new Subject<{
    comparedData: Record<string, Paint[][]>;
    globalData: Record<string, BrandData>;
  }>();

  constructor(
    private httpClient: HttpClient,
    private store: Store,
  ) {
    const paintAnalyzerWorkerFactroy = inject(PAINT_ANALYZER_WOKER_FACTORY);
    this.paintAnalyzer = paintAnalyzerWorkerFactroy();

    if (this.paintAnalyzer !== null) {
      this.paintAnalyzer.onmessage = (
        $event: MessageEvent<{
          comparedData: Record<string, Paint[][]>;
          globalData: Record<string, BrandData>;
        }>,
      ) => this.paintAnalyzerMessages.next($event.data);
    }

    this.paintAnalyzerMessages
      .asObservable()
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        Object.getOwnPropertyNames(data.comparedData).forEach((brand) => {
          const paints = data.comparedData[brand];
          store.dispatch(
            PaintComparisonActions.loadPaintsComplete({
              brand,
              paintCollection: paints,
            }),
          );
        });

        store.dispatch(StatusActions.setProcessing({ processing: false }));
      });
  }

  ngOnDestroy(): void {
    this.paintAnalyzer?.terminate();
  }

  loadPaintsByFilename(filename: string) {
    console.log('loading paints by filename', filename);
    return this.httpClient.get<PaintComparisonCollection>(`./json/${filename}`);
  }

  loadAllPaints() {
    return this.httpClient.get<Record<string, BrandData>>('./json/paints.json');
  }

  compareAllPaints(paints: Paint[]) {
    this.store.dispatch(StatusActions.setProcessing({ processing: true }));
    if (this.paintAnalyzer) {
      this.paintAnalyzer!.postMessage({
        paints,
      });
    }
  }
}
