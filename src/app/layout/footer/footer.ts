import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { LucideDynamicIcon, LucideMail, LucidePhone, LucideMapPin } from '@lucide/angular';

@Component({
  selector: 'app-footer',
  imports: [TranslocoModule, LucideDynamicIcon],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  year = new Date().getFullYear();

  mailIcon = LucideMail;
  phoneIcon = LucidePhone;
  pinIcon = LucideMapPin;

  quickLinks = [
    { key: 'home',    href: '#home' },
    { key: 'about',   href: '#about' },
    { key: 'modules', href: '#modules' },
    { key: 'why',     href: '#why' },
    { key: 'contact', href: '#contact' }
  ];

  moduleLinks = ['hr', 'payroll', 'finance', 'inventory', 'production'];
}