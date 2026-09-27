import { Component, input, output, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../../core/services/users';
import { RolesService, RoleListItem } from '../../../../core/services/roles';
import { UserListItem } from '../../../../core/models/user.models';
import { TranslocoModule } from '@jsverse/transloco';
import { ToastService } from '../../../../core/services/toast';

@Component({
  selector: 'app-user-roles-dialog',
  imports: [CommonModule, TranslocoModule],
  templateUrl: './user-roles-dialog.html',
  styleUrl: './user-roles-dialog.scss'
})
export class UserRolesDialog {
  private usersService = inject(UsersService);
  private rolesService = inject(RolesService);
  private toast = inject(ToastService);

  open = input<boolean>(false);
  user = input<UserListItem | null>(null);

  saved = output<void>();
  closed = output<void>();

  roles = signal<RoleListItem[]>([]);
  selectedRoles = signal<string[]>([]);
  loading = signal(false);

  constructor() {
    effect(() => {
      if (this.open() && this.user()) {
        this.selectedRoles.set([...this.user()!.roles]);
      }
    });
  }

  ngOnInit() {
    this.rolesService.getAll().subscribe(r => this.roles.set(r));
  }

  toggle(name: string) {
    this.selectedRoles.update(list =>
      list.includes(name) ? list.filter(r => r !== name) : [...list, name]
    );
  }

  isSelected(name: string): boolean {
    return this.selectedRoles().includes(name);
  }

  save() {
    const u = this.user();
    if (!u) return;

    this.loading.set(true);
    this.usersService.updateRoles(u.id, { roles: this.selectedRoles() }).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.success('admin.users.rolesUpdated');
        this.saved.emit();
      },
      error: () => this.loading.set(false)
    });
  }

  cancel() { this.closed.emit(); }
}