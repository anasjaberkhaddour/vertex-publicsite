import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { LangService, AppLang } from '../../core/services/lang';

@Component({
  selector: 'app-header',
  imports: [CommonModule, TranslocoModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  private langService = inject(LangService);

  menuOpen = signal(false);
  currentLang = this.langService.currentPublic;

  ngOnInit() {
    this.langService.initPublic();
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  switchLang(lang: AppLang) {
    if (this.currentLang() === lang) return;
    this.langService.setPublicLang(lang);
  }
}