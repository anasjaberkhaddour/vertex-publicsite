import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { LangService, AppLang } from '../../../core/services/lang';
import { TranslocoModule } from '@jsverse/transloco';
@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, TranslocoModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class AdminLayout implements OnInit {
  auth = inject(AuthService);
  private langService = inject(LangService);

  currentLang = this.langService.currentAdmin;

  ngOnInit() {
    this.langService.initAdmin();
  }

  switchLang(lang: AppLang) {
    if (this.currentLang() === lang) return;
    this.langService.setAdminLang(lang);
  }

  logout() {
    this.auth.logout();
  }
}