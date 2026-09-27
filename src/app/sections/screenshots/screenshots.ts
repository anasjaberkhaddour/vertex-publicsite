import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal, computed, ViewChild, ElementRef, effect } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { register } from 'swiper/element/bundle';
import { ContentService } from '../../core/services/content';
import { imageUrl } from '../../core/utils/image-url';

register();

@Component({
  selector: 'app-screenshots',
  imports: [TranslocoModule],
  templateUrl: './screenshots.html',
  styleUrl: './screenshots.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Screenshots {
  transloco = inject(TranslocoService);
  private contentService = inject(ContentService);
  private swiperContainer = signal<HTMLElement | null>(null);
  imageUrl = imageUrl;

  section = computed(() => this.contentService.getSection('screenshots'));
  slides = computed(() => this.section()?.blocks ?? []);

  @ViewChild('swiperRef') set swiperRef(el: ElementRef | undefined) {
    if (el) {
      this.swiperContainer.set(el.nativeElement);
    }
  }

  constructor() {
    effect(() => {
      const lang = this.transloco.activeLang();
      const dir = lang === 'ar' ? 'rtl' : 'ltr';

      setTimeout(() => {
        const container = this.swiperContainer();
        if (container) {
          (container as any).swiper?.destroy(true, true);
          (container as any).initialize();
        }
      }, 50);
    });
  }
}