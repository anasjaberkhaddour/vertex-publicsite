
import { Injectable, inject, signal, DOCUMENT } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export type AppLang = 'ar' | 'en';

@Injectable({ providedIn: 'root' })
export class LangService {
  private transloco = inject(TranslocoService);
  private document = inject(DOCUMENT);

  // مفاتيح مختلفة لكل سياق
  private readonly PUBLIC_KEY = 'vertex_public_lang';
  private readonly ADMIN_KEY = 'vertex_admin_lang';

  currentPublic = signal<AppLang>(this.readPublic());
  currentAdmin = signal<AppLang>(this.readAdmin());

  // ============ PUBLIC ============
  initPublic() {
    this.applyLang(this.currentPublic(), false);
  }

  setPublicLang(lang: AppLang) {
    this.currentPublic.set(lang);
    localStorage.setItem(this.PUBLIC_KEY, lang);
    this.applyLang(lang, false);
  }

  // ============ ADMIN ============
  initAdmin() {
    this.applyLang(this.currentAdmin(), true);
  }

  setAdminLang(lang: AppLang) {
    this.currentAdmin.set(lang);
    localStorage.setItem(this.ADMIN_KEY, lang);
    this.applyLang(lang, true);
  }

  // ============ CORE ============
  private applyLang(lang: AppLang, isAdmin: boolean) {
    this.transloco.setActiveLang(lang);
    this.document.documentElement.lang = lang;
    this.document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  private readPublic(): AppLang {
    return (localStorage.getItem(this.PUBLIC_KEY) as AppLang) || 'ar';
  }

  private readAdmin(): AppLang {
    return (localStorage.getItem(this.ADMIN_KEY) as AppLang) || 'ar';
  }
}