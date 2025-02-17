import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';

import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [MatAnchor, NgTemplateOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
