import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal, ViewChild, ElementRef, effect } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { register } from 'swiper/element/bundle';

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
  private swiperContainer = signal<HTMLElement | null>(null);

  @ViewChild('swiperRef') set swiperRef(el: ElementRef | undefined) {
    if (el) {
      this.swiperContainer.set(el.nativeElement);
    }
  }

  slides = [
    { key: 's1', image: '/screenshots/screen-1.png' },
    { key: 's2', image: '/screenshots/screen-2.png' },
    { key: 's3', image: '/screenshots/screen-3.png' },
    { key: 's4', image: '/screenshots/screen-4.png' },
    { key: 's5', image: '/screenshots/screen-5.png' }
  ];

  constructor() {
    effect(() => {
      const lang = this.transloco.activeLang();
      const dir = lang === 'ar' ? 'rtl' : 'ltr';
      
      // ننتظر قليلاً حتى يحدث Transloco تغيير dir في الـ DOM
      setTimeout(() => {
        const container = this.swiperContainer();
        if (container) {
          // إعادة تهيئة Swiper بالكامل
          (container as any).swiper?.destroy(true, true);
          (container as any).initialize();
        }
      }, 50);
    });
  }
}