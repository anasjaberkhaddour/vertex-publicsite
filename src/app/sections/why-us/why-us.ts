import { Component, inject, computed } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { LucideDynamicIcon } from '@lucide/angular';
import { Reveal } from '../../directives/reveal';
import { ContentService } from '../../core/services/content';
import { getIcon } from '../../core/utils/icon-map';
import { imageUrl } from '../../core/utils/image-url';

@Component({
  selector: 'app-why-us',
  imports: [TranslocoModule, LucideDynamicIcon, Reveal],
  templateUrl: './why-us.html',
  styleUrl: './why-us.scss'
})
export class WhyUs {
  private contentService = inject(ContentService);

  section = computed(() => this.contentService.getSection('why'));

  statBlock = computed(() =>
    this.section()?.blocks.find(b => b.type === 'stat')
  );

  featureBlocks = computed(() =>
    this.section()?.blocks.filter(b => b.type !== 'stat') ?? []
  );

  getIcon = getIcon;
  imageUrl = imageUrl;
}