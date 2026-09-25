import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactMessage } from '../../../../core/models/contact.models';

@Component({
  selector: 'app-message-details-dialog',
  imports: [CommonModule],
  templateUrl: './message-details-dialog.html',
  styleUrl: './message-details-dialog.scss'
})
export class MessageDetailsDialog {
  open = input<boolean>(false);
  message = input<ContactMessage | null>(null);
  closed = output<void>();

  close() { this.closed.emit(); }
}