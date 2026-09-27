import { Component, inject, OnInit, effect } from '@angular/core';
import { Header } from '../../../layout/header/header';
import { Hero } from '../../../sections/hero/hero';
import { Modules } from '../../../sections/modules/modules';
import { Screenshots } from '../../../sections/screenshots/screenshots';
import { WhyUs } from '../../../sections/why-us/why-us';
import { Process } from '../../../sections/process/process';
import { Faq } from '../../../sections/faq/faq';
import { Cta } from '../../../sections/cta/cta';
import { Contact } from '../../../sections/contact/contact';
import { Footer } from '../../../layout/footer/footer';
import { VisitService } from '../../../core/services/visit';
import { ContentService } from '../../../core/services/content';
import { LangService } from '../../../core/services/lang';

@Component({
  selector: 'app-landing',
  imports: [Header, Hero, Modules, Screenshots, WhyUs, Process, Faq, Cta, Contact, Footer],
  template: `
    <app-header />
    <app-hero />
    <app-modules />
    <app-screenshots />
    <app-why-us />
    <app-process />
    <app-faq />
    <app-cta />
    <app-contact />
    <app-footer />
  `
})
export class Landing implements OnInit {
  private visitService = inject(VisitService);
  private contentService = inject(ContentService);
  private langService = inject(LangService);

  constructor() {
    // راقب تغيّر لغة الموقع → أعد تحميل المحتوى
    effect(() => {
      const lang = this.langService.currentPublic();
      this.contentService.loadAll(lang).subscribe();
    });
  }

  ngOnInit() {
    this.visitService.trackVisit();
  }
}