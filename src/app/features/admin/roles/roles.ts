import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { RolesService, RoleListItem } from '../../../core/services/roles';
import { RoleFormDialog } from './role-form-dialog/role-form-dialog';
import { RolePermissionsDialog } from './role-permissions-dialog/role-permissions-dialog';
import { ToastService } from '../../../core/services/toast';
import { ConfirmService } from '../../../core/services/confirm';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-admin-roles',
  imports: [CommonModule, RoleFormDialog, RolePermissionsDialog, TranslocoModule],
  templateUrl: './roles.html',
  styleUrl: './roles.scss'
})
export class AdminRoles implements OnInit {
  private rolesService = inject(RolesService);
  private toast = inject(ToastService);
  private confirm = inject(ConfirmService);
  auth = inject(AuthService);

  loading = signal(false);
  roles = signal<RoleListItem[]>([]);

  // TODO: Dialogs
  showFormDialog = signal(false);
  editingRole = signal<RoleListItem | null>(null);
  showPermissionsDialog = signal(false);
  permissionsRole = signal<RoleListItem | null>(null);

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.rolesService.getAll().subscribe({
      next: r => {
        this.roles.set(r);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  can(permission: string): boolean {
    return this.auth.hasPermission(permission);
  }

  isProtected(role: RoleListItem): boolean {
    return role.name === 'Admin';
  }

  openCreateDialog() {
    this.editingRole.set(null);
    this.showFormDialog.set(true);
  }

  openEditDialog(role: RoleListItem) {
    if (this.isProtected(role)) return;
    this.editingRole.set(role);
    this.showFormDialog.set(true);
  }

  openPermissionsDialog(role: RoleListItem) {
    if (this.isProtected(role)) return;
    this.permissionsRole.set(role);
    this.showPermissionsDialog.set(true);
  }

  closeFormDialog() {
    this.showFormDialog.set(false);
    this.editingRole.set(null);
  }

  closePermissionsDialog() {
    this.showPermissionsDialog.set(false);
    this.permissionsRole.set(null);
  }

  onSaved() {
    this.closeFormDialog();
    this.closePermissionsDialog();
    this.load();
  }
  
  async deleteRole(role: RoleListItem) {
    if (this.isProtected(role)) return;
  
    const ok = await this.confirm.confirm({
      title: 'admin.roles.deleteTitle',
      message: 'admin.roles.deleteMessage',
      type: 'danger',
      confirmText: 'admin.common.delete'
    });
    if (!ok) return;
  
    this.rolesService.delete(role.id).subscribe({
      next: () => {
        this.toast.success('admin.roles.roleDeleted');
        this.load();
      }
    });
  }
}