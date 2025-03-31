import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Paint, PaintComparisonCollection } from '@/models/paint';
import { BrandData } from '@/models/brand-data';
import { Store } from '@ngrx/store';
import { PaintComparisonActions } from '../store/actions/paint-comparison.actions';

@Injectable({
  providedIn: 'root',
})
export class PaintsService {
  paintAnalyzer: Worker | null = null;

  constructor(
    private httpClient: HttpClient,
    store: Store,
  ) {
    if (typeof Worker !== 'undefined') {
      this.paintAnalyzer = new Worker(
        new URL('../workers/paint-analyzer.worker', import.meta.url),
      );

      this.paintAnalyzer.onmessage = (
        $event: MessageEvent<{
          comparedData: Record<string, Paint[][]>;
          globalData: Record<string, BrandData>;
        }>,
      ) => {
        Object.getOwnPropertyNames($event.data.comparedData).forEach(
          (brand) => {
            const paints = $event.data.comparedData[brand];
            store.dispatch(
              PaintComparisonActions.loadPaintsComplete({
                brand,
                paintCollection: paints,
              }),
            );
          },
        );
      };
    }
  }

  loadPaintsByFilename(filename: string) {
    console.log('loading paints by filename', filename);
    return this.httpClient.get<PaintComparisonCollection>(`./json/${filename}`);
  }

  loadAllPaints() {
    return this.httpClient.get<Record<string, BrandData>>('./json/paints.json');
  }

  compareAllPaints(paints: Paint[]) {
    if (this.paintAnalyzer) {
      this.paintAnalyzer!.postMessage({
        paints,
      });
    }
  }
}
