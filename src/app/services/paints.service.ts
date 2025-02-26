import { Paint, PaintComparisonCollection } from '@/models/paint';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import convert from 'color-convert';

@Injectable({
  providedIn: 'root',
})
export class PaintsService {
  constructor(private httpClient: HttpClient) {}

  loadPaintsByFilename(filename: string) {
    console.log('loading paints by filename', filename);
    return this.httpClient.get<PaintComparisonCollection>(`./json/${filename}`);
  }

  calculateDeltaE(basePaint: Paint, compairedTo: Paint) {
    const basePaintLabColor = convert.hex.lab(basePaint.color);
    const compariedToLabColor = convert.hex.lab(compairedTo.color);

    const lDiff = basePaintLabColor[0] - compariedToLabColor[0];
    const aDiff = basePaintLabColor[1] - compariedToLabColor[1];
    const bDiff = basePaintLabColor[2] - compariedToLabColor[2];

    return Math.sqrt(lDiff * lDiff + aDiff * aDiff + bDiff * bDiff);
  }
}
