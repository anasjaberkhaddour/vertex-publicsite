import { Injectable, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { LangService } from './lang';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private transloco = inject(TranslocoService);
  private langService = inject(LangService);

  toasts = signal<Toast[]>([]);
  private counter = 0;

  success(messageKey: string) { this.show('success', messageKey); }
  error(messageKey: string)   { this.show('error', messageKey); }
  info(messageKey: string)    { this.show('info', messageKey); }
  warning(messageKey: string) { this.show('warning', messageKey); }

  private show(type: Toast['type'], messageKey: string) {
    const id = ++this.counter;
    const lang = this.langService.currentAdmin();
    const message = this.transloco.translate(messageKey, {}, lang);
    this.toasts.update(list => [...list, { id, type, message }]);
    setTimeout(() => this.dismiss(id), 4500);
  }

  dismiss(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}