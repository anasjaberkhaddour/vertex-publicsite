import { Component, inject, computed } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { LucideDynamicIcon } from '@lucide/angular';
import { Reveal } from '../../directives/reveal';
import { ContentService } from '../../core/services/content';
import { getIcon } from '../../core/utils/icon-map';

@Component({
  selector: 'app-process',
  imports: [TranslocoModule, LucideDynamicIcon, Reveal],
  templateUrl: './process.html',
  styleUrl: './process.scss'
})
export class Process {
  private contentService = inject(ContentService);

  section = computed(() => this.contentService.getSection('process'));
  steps = computed(() => this.section()?.blocks ?? []);

  getIcon = getIcon;
}