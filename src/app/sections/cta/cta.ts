import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-cta',
  imports: [TranslocoModule],
  templateUrl: './cta.html',
  styleUrl: './cta.scss'
})
export class Cta {}