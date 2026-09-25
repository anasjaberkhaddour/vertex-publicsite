import { Component, input, output, signal, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesService, RoleListItem, Permission } from '../../../../core/services/roles';
import { ToastService } from '../../../../core/services/toast';

@Component({
  selector: 'app-role-permissions-dialog',
  imports: [CommonModule],
  templateUrl: './role-permissions-dialog.html',
  styleUrl: './role-permissions-dialog.scss'
})
export class RolePermissionsDialog implements OnInit {
  private rolesService = inject(RolesService);
  private toast = inject(ToastService);

  open = input<boolean>(false);
  role = input<RoleListItem | null>(null);

  saved = output<void>();
  closed = output<void>();

  permissions = signal<Permission[]>([]);
  selectedIds = signal<number[]>([]);
  loading = signal(false);

  constructor() {
    effect(() => {
      if (this.open() && this.role()) {
        this.rolesService.getById(this.role()!.id).subscribe(details => {
          const all = this.permissions();
          const ids = details.permissions
            .map(name => all.find(p => p.name === name)?.id)
            .filter((id): id is number => id !== undefined);
          this.selectedIds.set(ids);
        });
      }
    });
  }

  ngOnInit() {
    this.rolesService.getAllPermissions().subscribe(p => this.permissions.set(p));
  }

  toggle(id: number) {
    this.selectedIds.update(list =>
      list.includes(id) ? list.filter(x => x !== id) : [...list, id]
    );
  }

  isSelected(id: number): boolean {
    return this.selectedIds().includes(id);
  }

  save() {
    const r = this.role();
    if (!r) return;

    this.loading.set(true);
    this.rolesService.assignPermissions(r.id, this.selectedIds()).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.success('تم تحديث الصلاحيات');
        this.saved.emit();
      },
      error: () => this.loading.set(false)
    });
  }

  cancel() { this.closed.emit(); }
}