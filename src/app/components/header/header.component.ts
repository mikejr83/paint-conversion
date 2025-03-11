import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';

import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatAnchor, NgTemplateOutlet, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
