import { PaintComparisonCollection } from '@/models/paint';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaintsService {
  constructor(private httpClient: HttpClient) {}

  loadPaintsByFilename(filename: string) {
    console.log('loading paints by filename', filename);
    return this.httpClient.get<PaintComparisonCollection>(
      `./json/${filename}`,
    );
  }
}
