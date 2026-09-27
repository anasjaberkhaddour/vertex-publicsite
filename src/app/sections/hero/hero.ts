import { Component, inject, computed } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ContentService } from '../../core/services/content';

@Component({
  selector: 'app-hero',
  imports: [TranslocoModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero {
  private contentService = inject(ContentService);

  section = computed(() => this.contentService.getSection('hero'));
}