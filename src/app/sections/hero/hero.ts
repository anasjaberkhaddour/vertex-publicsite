import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-hero',
  imports: [TranslocoModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero {}