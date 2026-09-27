import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../../services/confirm';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule, TranslocoModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss'
})
export class ConfirmDialog {
  confirm = inject(ConfirmService);
}