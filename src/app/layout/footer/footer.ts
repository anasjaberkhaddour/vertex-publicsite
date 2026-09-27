import { Component, inject, computed } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { LucideDynamicIcon } from '@lucide/angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { getSocialSvg as getSocialSvgRaw, getIcon } from '../../core/utils/icon-map';
import { ContentService } from '../../core/services/content';

@Component({
  selector: 'app-footer',
  imports: [TranslocoModule, LucideDynamicIcon],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  private sanitizer = inject(DomSanitizer);
  private contentService = inject(ContentService);

  year = new Date().getFullYear();

  brandSection = computed(() => this.contentService.getSection('footer-brand'));
  socialBlocks = computed(() => this.brandSection()?.blocks ?? []);

  contactBlocks = computed(() =>
    (this.contentService.getSection('contact')?.blocks ?? [])
      .filter(b => b.isFeatured)
  );

  moduleBlocks = computed(() =>
    (this.contentService.getSection('modules')?.blocks ?? [])
      .filter(b => b.isFeatured)
  );

  quickLinks = [
    { key: 'home',    href: '#home' },
    { key: 'about',   href: '#about' },
    { key: 'modules', href: '#modules' },
    { key: 'why',     href: '#why' },
    { key: 'contact', href: '#contact' }
  ];

  getIcon = getIcon;

  getSocialSvg(name: string): SafeHtml | null {
    const raw = getSocialSvgRaw(name);
    return raw ? this.sanitizer.bypassSecurityTrustHtml(raw) : null;
  }
}