import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-header',
  imports: [CommonModule, TranslocoModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  private transloco = inject(TranslocoService);
  private document = inject(DOCUMENT);

  menuOpen = signal(false);
  currentLang = signal<'ar' | 'en'>('ar');

  ngOnInit() {
    const saved = (localStorage.getItem('lang') as 'ar' | 'en') || 'ar';
    this.applyLang(saved);
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  switchLang(lang: 'ar' | 'en') {
    if (this.currentLang() === lang) return;
    this.applyLang(lang);
  }

  private applyLang(lang: 'ar' | 'en') {
    this.transloco.setActiveLang(lang);
    this.currentLang.set(lang);
    this.document.documentElement.lang = lang;
    this.document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('lang', lang);
  }
}