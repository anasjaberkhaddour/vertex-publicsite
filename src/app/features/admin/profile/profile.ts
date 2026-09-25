import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../core/services/users';
import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast';
import { UserDetails, ChangePasswordRequest } from '../../../core/models/user.models';

@Component({
  selector: 'app-admin-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class AdminProfile implements OnInit {
  private usersService = inject(UsersService);
  private toast = inject(ToastService);
  auth = inject(AuthService);

  loading = signal(true);
  details = signal<UserDetails | null>(null);

  // Change Password
  passwordForm: ChangePasswordRequest = { currentPassword: '', newPassword: '' };
  confirmPassword = '';
  savingPassword = signal(false);

  ngOnInit() {
    const id = this.auth.currentUser()?.id;
    if (!id) return;

    this.usersService.getById(id).subscribe({
      next: d => {
        this.details.set(d);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  passwordMismatch(): boolean {
    return !!this.confirmPassword && this.passwordForm.newPassword !== this.confirmPassword;
  }

  changePassword(e: Event) {
    e.preventDefault();
    if (this.passwordMismatch() || !this.passwordForm.newPassword) return;

    this.savingPassword.set(true);
    this.usersService.changePassword(this.passwordForm).subscribe({
      next: () => {
        this.savingPassword.set(false);
        this.passwordForm = { currentPassword: '', newPassword: '' };
        this.confirmPassword = '';
        this.toast.success('تم تغيير كلمة المرور');
      },
      error: () => this.savingPassword.set(false)
    });
  }
}