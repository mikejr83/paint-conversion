import { InjectionToken } from '@angular/core';

export const PAINT_ANALYZER_WOKER_FACTORY = new InjectionToken<
  () => Worker | null
>('Paint Analyzer Worker Factory', {
  providedIn: 'root',
  factory: () => {
    return () =>
      new Worker(new URL('../workers/paint-analyzer.worker', import.meta.url), {
        type: 'module',
      });
  },
});
