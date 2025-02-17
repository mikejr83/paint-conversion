import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';

import { PaintsService } from './services/paints.service';

import { ComparisonGridComponent } from './components/comparison-grid/comparison-grid.component';
import { FilterComponent } from './components/filter/filter.component';
import { HeaderComponent } from './components/header/header.component';
import { selectCurrentBrand } from './store/selectors/brand.selector';
import { selectPaintState } from './store/reducers';
import { combineLatest, filter, map } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-root',
  imports: [
    ComparisonGridComponent,
    FilterComponent,
    HeaderComponent,
    MatSelectModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'paint-conversion';

  createIssueHref;
  createFeatureRequestHref;
  createNewPaintRequestHref;

  constructor(
    private paintsService: PaintsService,
    private store: Store,
  ) {
    const issueBody = `# General Issue

*Please make sure to set a meaningful title!*

## Noted Behavior

*Please enter a short description of the issue that you are seeing. If the issue occurs after a series of steps, please enumerate the exact steps to reproduce it.*

## Expected Behavior

*Please describe what you think or expect to happen.*

## Other notes

*Add any additional information that may help to solve the issue.*`;

    const issueRequestBody = `# Feature Request

*Add in a detailed description of what you would like to see the site provide or the application to perform. Change the title to be descriptive of your feature request. Please provide exact detail in the functionality you are expecting. It will help to have a series of steps that describe how you would interact with this new feature.*`;

    const newPaintAdditionRequest = `# Add New Paint

*The following data is needed to add a new paint:*

* Brand name *Citadel, Vallejo, etc.*
* Series name *Base, Layer, Game Color, etc.*
* Hex HTML color *#bcb686, #f3e72e, etc.*
* Method on how color was determined: *Calibrite Display 123, Datacolor Spyder X2, etc*
* Matches for the following brands/series
  * Citadel
  * Vallejo Model Color
  * Vallejo Game Color
  * P3
  * Army Painter

*The data for the site strives to be as accurate as possible. At minimum, the representative hex HTML color should be an average taken from a graded picture of the color in question. This can be performed with a good camera, a color test target card, and a good light source with a known color temperature.*`;

    this.createIssueHref = `https://github.com/mikejr83/paint-conversion/issues/new?body=${encodeURIComponent(issueBody)}&title=${encodeURIComponent('I Found A Problem!')}`;
    this.createFeatureRequestHref = `https://github.com/mikejr83/paint-conversion/issues/new?body=${encodeURIComponent(issueRequestBody)}&title=${encodeURIComponent('Feature Request')}`;
    this.createNewPaintRequestHref = `https://github.com/mikejr83/paint-conversion/issues/new?body=${encodeURIComponent(newPaintAdditionRequest)}&title=${encodeURIComponent('New Paint Request')}`;
  }
}
