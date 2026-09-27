import { Component, inject, computed } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { LucideDynamicIcon } from '@lucide/angular';
import { Reveal } from '../../directives/reveal';
import { ContentService } from '../../core/services/content';
import { getIcon } from '../../core/utils/icon-map';

@Component({
  selector: 'app-modules',
  imports: [TranslocoModule, LucideDynamicIcon, Reveal],
  templateUrl: './modules.html',
  styleUrl: './modules.scss'
})
export class Modules {
  private contentService = inject(ContentService);

  section = computed(() => this.contentService.getSection('modules'));

  getIcon = getIcon;
}