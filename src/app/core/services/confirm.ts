import { Injectable, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { LangService } from './lang';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export interface ConfirmResolved {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: 'danger' | 'warning' | 'info';
}

interface ConfirmState extends ConfirmResolved {
  resolve: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private transloco = inject(TranslocoService);
  private langService = inject(LangService);

  state = signal<ConfirmState | null>(null);

  confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const lang = this.langService.currentAdmin();
      const resolved: ConfirmResolved = {
        title: this.transloco.translate(options.title, {}, lang),
        message: this.transloco.translate(options.message, {}, lang),
        confirmText: options.confirmText
          ? this.transloco.translate(options.confirmText, {}, lang)
          : this.transloco.translate('admin.common.confirm', {}, lang),
        cancelText: options.cancelText
          ? this.transloco.translate(options.cancelText, {}, lang)
          : this.transloco.translate('admin.common.cancel', {}, lang),
        type: options.type ?? 'info'
      };
      this.state.set({ ...resolved, resolve });
    });
  }

  accept() {
    const s = this.state();
    if (!s) return;
    s.resolve(true);
    this.state.set(null);
  }

  cancel() {
    const s = this.state();
    if (!s) return;
    s.resolve(false);
    this.state.set(null);
  }
}