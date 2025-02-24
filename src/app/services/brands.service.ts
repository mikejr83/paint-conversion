import { Injectable } from '@angular/core';
import { Brand } from '@/models/brand';
import { of } from 'rxjs';
import {
  armyPainter,
  citadel,
  p3,
  vallejoGame,
  vallejoModel,
} from '@/constants/brands';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  public loadBrands() {
    const brands: Brand[] = [
      {
        ...citadel,
        filename: 'citadel.json',
        series: [],
      },
      {
        ...armyPainter,
        filename: 'army-painter.json',
        series: [],
      },
      {
        ...vallejoModel,
        filename: 'vallejo-model.json',
        series: [],
      },
      {
        ...vallejoGame,
        filename: 'vallejo-game.json',
        series: [],
      },
      {
        ...p3,
        filename: 'p3.json',
        series: [],
      },
    ];

    return of(brands);
  }
}
