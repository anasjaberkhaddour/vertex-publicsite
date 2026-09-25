import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private counter = 0;

  success(message: string) { this.show('success', message); }
  error(message: string)   { this.show('error', message); }
  info(message: string)    { this.show('info', message); }
  warning(message: string) { this.show('warning', message); }

  private show(type: Toast['type'], message: string) {
    const id = ++this.counter;
    this.toasts.update(list => [...list, { id, type, message }]);
    setTimeout(() => this.dismiss(id), 4500);
  }

  dismiss(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}