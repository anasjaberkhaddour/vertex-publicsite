import { Component, signal, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslocoModule } from '@jsverse/transloco';
import { NgxTurnstileModule } from 'ngx-turnstile';
import {
  LucideDynamicIcon, LucideSend
} from '@lucide/angular';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast';
import { ContentService } from '../../core/services/content';
import { getIcon } from '../../core/utils/icon-map';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, TranslocoModule, LucideDynamicIcon, NgxTurnstileModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private contentService = inject(ContentService);

  submitted = signal(false);
  loading = signal(false);

  section = computed(() => this.contentService.getSection('contact'));
  infoBlocks = computed(() => this.section()?.blocks ?? []);

  sendIcon = LucideSend;
  getIcon = getIcon;

  form = {
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  };

  captchaToken = signal<string | null>(null);
  siteKey = environment.turnstileSiteKey;

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