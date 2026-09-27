import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { ContentService, AdminSection } from '../../../core/services/content';
import { AuthService } from '../../../core/services/auth';
import { LangService } from '../../../core/services/lang';

@Component({
  selector: 'app-admin-content',
  imports: [CommonModule, RouterLink, TranslocoModule],
  templateUrl: './content.html',
  styleUrl: './content.scss'
})
export class AdminContent {
  private contentService = inject(ContentService);
  private langService = inject(LangService);
  auth = inject(AuthService);

  loading = signal(false);
  sections = signal<AdminSection[]>([]);

  get currentLang(): string {
    return this.langService.currentAdmin();
  }

  constructor() {
    // راقب تغيّر لغة الأدمن → أعد تحميل الأقسام
    effect(() => {
      const lang = this.langService.currentAdmin();
      this.load(lang);
    });
  }

  load(lang: string) {
    this.loading.set(true);
    this.contentService.getAdminSections(lang).subscribe({
      next: s => {
        this.sections.set(s);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  can(permission: string): boolean {
    return this.auth.hasPermission(permission);
  }
}