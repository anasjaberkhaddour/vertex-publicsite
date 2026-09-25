import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { ContactService } from '../../../core/services/contact';
import { ConfirmService } from '../../../core/services/confirm';
import { ToastService } from '../../../core/services/toast';
import { ContactMessage } from '../../../core/models/contact.models';
import { MessageDetailsDialog } from './message-details-dialog/message-details-dialog';

@Component({
  selector: 'app-admin-messages',
  imports: [CommonModule, MessageDetailsDialog],
  templateUrl: './messages.html',
  styleUrl: './messages.scss'
})
export class AdminMessages implements OnInit {
  private contactService = inject(ContactService);
  private confirm = inject(ConfirmService);
  private toast = inject(ToastService);
  auth = inject(AuthService);

  loading = signal(false);
  messages = signal<ContactMessage[]>([]);
  filter = signal<'all' | 'unread'>('all');

  showDetails = signal(false);
  selectedMessage = signal<ContactMessage | null>(null);

  filteredMessages = () => {
    const list = this.messages();
    return this.filter() === 'unread' ? list.filter(m => !m.isRead) : list;
  };

  unreadCount = () => this.messages().filter(m => !m.isRead).length;

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.contactService.getAll().subscribe({
      next: m => {
        this.messages.set(m);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  setFilter(f: 'all' | 'unread') { this.filter.set(f); }

  can(permission: string): boolean {
    return this.auth.hasPermission(permission);
  }

  openDetails(msg: ContactMessage) {
    this.selectedMessage.set(msg);
    this.showDetails.set(true);

    if (!msg.isRead) {
      this.contactService.markAsRead(msg.id).subscribe({
        next: () => {
          this.messages.update(list =>
            list.map(m => m.id === msg.id ? { ...m, isRead: true } : m)
          );
        }
      });
    }
  }

  closeDetails() {
    this.showDetails.set(false);
    this.selectedMessage.set(null);
  }

  async deleteMessage(msg: ContactMessage) {
    const ok = await this.confirm.confirm({
      title: 'حذف الرسالة',
      message: `هل أنت متأكد من حذف رسالة "${msg.name}"؟`,
      type: 'danger',
      confirmText: 'حذف'
    });
    if (!ok) return;

    this.contactService.delete(msg.id).subscribe({
      next: () => {
        this.toast.success('تم حذف الرسالة');
        this.load();
      }
    });
  }
}