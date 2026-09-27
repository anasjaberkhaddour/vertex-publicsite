import { Component, inject, computed } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ContentService } from '../../core/services/content';

@Component({
  selector: 'app-cta',
  imports: [TranslocoModule],
  templateUrl: './cta.html',
  styleUrl: './cta.scss'
})
export class Cta {
  private contentService = inject(ContentService);

  section = computed(() => this.contentService.getSection('cta'));
}