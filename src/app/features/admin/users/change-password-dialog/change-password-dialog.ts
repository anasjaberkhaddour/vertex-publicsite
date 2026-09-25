import { Component, input, output, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../../core/services/users';
import { UserListItem } from '../../../../core/models/user.models';

@Component({
  selector: 'app-change-password-dialog',
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password-dialog.html',
  styleUrl: './change-password-dialog.scss'
})
export class ChangePasswordDialog {
  private usersService = inject(UsersService);

  open = input<boolean>(false);
  user = input<UserListItem | null>(null);

  saved = output<void>();
  closed = output<void>();

  loading = signal(false);
  newPassword = '';
  confirmPassword = '';

  submit(e: Event) {
    e.preventDefault();

    if (this.newPassword !== this.confirmPassword) {
      return;
    }

    const u = this.user();
    if (!u) return;

    this.loading.set(true);
    this.usersService.resetPassword(u.id, this.newPassword).subscribe({
      next: () => {
        this.loading.set(false);
        this.newPassword = '';
        this.confirmPassword = '';
        this.saved.emit();
      },
      error: () => this.loading.set(false)
    });
  }

  cancel() {
    this.newPassword = '';
    this.confirmPassword = '';
    this.closed.emit();
  }

  mismatch(): boolean {
    return !!this.confirmPassword && this.newPassword !== this.confirmPassword;
  }
}