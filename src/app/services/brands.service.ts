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
        name: "Army Painter",
        key: "ARMY_PAINTER",
        filename: "army-painter.json",
        series: []
      },
      {
        name: " Vallejo Model Color",
        key: "VALLEJO_MODEL_COLOR",
        filename: "vallejo-model.json",
        series: []
      },
      {
        name: " Vallejo Game Color",
        key: "VALLEJO_GAME_COLOR",
        filename: "vallejo-game.json",
        series: []
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
