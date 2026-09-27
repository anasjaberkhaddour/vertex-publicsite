import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../core/services/users';
import { AuthService } from '../../../core/services/auth';
import { UserListItem, PagedResult } from '../../../core/models/user.models';
import { UserFormDialog } from './user-form-dialog/user-form-dialog';
import { UserRolesDialog } from './user-roles-dialog/user-roles-dialog';
import { ChangePasswordDialog } from './change-password-dialog/change-password-dialog';
import { ToastService } from '../../../core/services/toast';
import { ConfirmService } from '../../../core/services/confirm';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule, FormsModule, UserFormDialog, UserRolesDialog, ChangePasswordDialog, TranslocoModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class AdminUsers implements OnInit {
  private usersService = inject(UsersService);
  private toast = inject(ToastService);
  private confirm = inject(ConfirmService);
  auth = inject(AuthService);

  loading = signal(false);
  users = signal<UserListItem[]>([]);
  totalCount = signal(0);
  page = signal(1);
  pageSize = signal(10);
  search = signal('');

  // Dialogs
  showFormDialog = signal(false);
  editingUser = signal<UserListItem | null>(null);

  showRolesDialog = signal(false);
  rolesUser = signal<UserListItem | null>(null);

  showPasswordDialog = signal(false);
  passwordUser = signal<UserListItem | null>(null);

  totalPages = () => Math.ceil(this.totalCount() / this.pageSize()) || 1;
  pages = () => Array.from({ length: this.totalPages() }, (_, i) => i + 1);

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.usersService.getAll(this.page(), this.pageSize(), this.search()).subscribe({
      next: (res: PagedResult<UserListItem>) => {
        this.users.set(res.items);
        this.totalCount.set(res.totalCount);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch(value: string) {
    this.search.set(value);
    this.page.set(1);
    this.load();
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.load();
  }

  can(permission: string): boolean {
    return this.auth.hasPermission(permission);
  }

  // ===== Form Dialog =====
  openCreateDialog() {
    this.editingUser.set(null);
    this.showFormDialog.set(true);
  }
  openEditDialog(u: UserListItem) {
    this.editingUser.set(u);
    this.showFormDialog.set(true);
  }
  closeFormDialog() {
    this.showFormDialog.set(false);
    this.editingUser.set(null);
  }
  onFormSaved() { this.closeFormDialog(); this.load(); }

  // ===== Roles Dialog =====
  openRolesDialog(u: UserListItem) {
    this.rolesUser.set(u);
    this.showRolesDialog.set(true);
  }
  closeRolesDialog() {
    this.showRolesDialog.set(false);
    this.rolesUser.set(null);
  }
  onRolesSaved() { this.closeRolesDialog(); this.load(); }

  // ===== Password Dialog =====
  openChangePasswordDialog(u: UserListItem) {
    this.passwordUser.set(u);
    this.showPasswordDialog.set(true);
  }
  closePasswordDialog() {
    this.showPasswordDialog.set(false);
    this.passwordUser.set(null);
  }
  onPasswordSaved() { this.closePasswordDialog(); }

  // ===== Actions =====
  toggleActive(u: UserListItem) {
    this.usersService.update(u.id, { fullName: u.fullName, isActive: !u.isActive })
      .subscribe({
        next: () => {
          this.toast.success(u.isActive ? 'admin.users.userDeactivated' : 'admin.users.userActivated');
          this.load();
        }
      });
  }

  async deleteUser(u: UserListItem) {
    const ok = await this.confirm.confirm({
      title: 'admin.users.deleteTitle',
      message: 'admin.users.deleteMessage',
      type: 'danger',
      confirmText: 'admin.common.delete'
    });
    if (!ok) return;
  
    this.usersService.delete(u.id).subscribe({
      next: () => {
        this.toast.success('admin.users.userDeleted');
        this.load();
      }
    });
  }
}