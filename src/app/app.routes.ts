import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'paints',
    loadComponent: () =>
      import('./pages/paints-utility/paints-utility.component').then(
        (c) => c.PaintsUtilityComponent,
      ),
  },
];
