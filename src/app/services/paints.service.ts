import { PaintComparisonCollection } from '@/models/paint';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaintsService {
  constructor(private httpClient: HttpClient) {}

  loadPaints(brand: string) {
    return this.httpClient.get<PaintComparisonCollection>(
      `./json/${brand}.json`,
    );
  }
}
