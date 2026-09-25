import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslocoModule } from '@jsverse/transloco';
import {
  LucideDynamicIcon, LucideMail, LucidePhone, LucideMapPin, LucideClock, LucideSend
} from '@lucide/angular';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast';
import { NgxTurnstileModule } from 'ngx-turnstile';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, TranslocoModule, LucideDynamicIcon, NgxTurnstileModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  submitted = signal(false);
  loading = signal(false);

  mailIcon = LucideMail;
  phoneIcon = LucidePhone;
  pinIcon = LucideMapPin;
  clockIcon = LucideClock;
  sendIcon = LucideSend;

  captchaToken = signal<string | null>(null);
  //siteKey = '0x4AAAAAAFDJCW2OwfCc_3Pk'; // من Cloudflare
  siteKey = environment.turnstileSiteKey;

  form = {
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  };

  onSubmit(e: Event) {
    e.preventDefault();
    this.loading.set(true);

    this.http.post<{ message: string }>(`${environment.apiUrl}/contact`, {
      ...this.form,
      turnstileToken: this.captchaToken()
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.submitted.set(true);
        this.toast.success(res.message);
      },
      error: () => this.loading.set(false)
    });
  }
}