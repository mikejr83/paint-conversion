import { Injectable } from '@angular/core';
import { Brand } from '@/models/brand';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  public loadBrands() {
    const brands: Brand[] = [
      {
        name: 'Citadel',
        key: 'CITADEL',
        filename: 'citadel.json',
        series: [],
      },
      {
        name: 'P3',
        key: 'P3',
        filename: 'p3.json',
        series: [],
      },
    ];

    return of(brands);
  }
}
