import { Injectable, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private transloco = inject(TranslocoService);

  toasts = signal<Toast[]>([]);
  private counter = 0;

  success(messageKey: string) { this.show('success', messageKey); }
  error(messageKey: string)   { this.show('error', messageKey); }
  info(messageKey: string)    { this.show('info', messageKey); }
  warning(messageKey: string) { this.show('warning', messageKey); }

  private show(type: Toast['type'], messageKey: string) {
    const id = ++this.counter;
    const message = this.transloco.translate(messageKey);
    this.toasts.update(list => [...list, { id, type, message }]);
    setTimeout(() => this.dismiss(id), 4500);
  }

  dismiss(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}