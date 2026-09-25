import { Component, input, output, signal, effect, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RolesService, RoleListItem, Permission } from '../../../../core/services/roles';

@Component({
  selector: 'app-role-form-dialog',
  imports: [CommonModule, FormsModule],
  templateUrl: './role-form-dialog.html',
  styleUrl: './role-form-dialog.scss'
})
export class RoleFormDialog implements OnInit {
  private rolesService = inject(RolesService);

  open = input<boolean>(false);
  role = input<RoleListItem | null>(null);

  saved = output<void>();
  closed = output<void>();

  permissions = signal<Permission[]>([]);
  selectedPermissionIds = signal<number[]>([]);
  loading = signal(false);

  form = {
    name: '',
    description: ''
  };

  constructor() {
    effect(() => {
      if (this.open()) {
        const r = this.role();
        this.selectedPermissionIds.set([]);
        if (r) {
          // وضع التعديل — نحمّل تفاصيل الدور
          this.form = { name: r.name, description: r.description ?? '' };
          this.rolesService.getById(r.id).subscribe(details => {
            // نحتاج IDs للصلاحيات، لكن `details` يعيد أسماء فقط.
            // الحل: نطابق الأسماء مع القائمة الكاملة.
            const all = this.permissions();
            const ids = details.permissions
              .map(name => all.find(p => p.name === name)?.id)
              .filter((id): id is number => id !== undefined);
            this.selectedPermissionIds.set(ids);
          });
        } else {
          this.form = { name: '', description: '' };
        }
      }
    });
  }

  ngOnInit() {
    this.rolesService.getAllPermissions().subscribe(p => this.permissions.set(p));
  }

  isEdit(): boolean { return !!this.role(); }

  togglePermission(id: number) {
    this.selectedPermissionIds.update(list =>
      list.includes(id) ? list.filter(x => x !== id) : [...list, id]
    );
  }

  isSelected(id: number): boolean {
    return this.selectedPermissionIds().includes(id);
  }

  submit(e: Event) {
    e.preventDefault();
    this.loading.set(true);

    const r = this.role();

    if (r) {
      // تعديل — الوصف + الصلاحيات
      this.rolesService.update(r.id, { description: this.form.description }).subscribe({
        next: () => {
          this.rolesService.assignPermissions(r.id, this.selectedPermissionIds()).subscribe({
            next: () => {
              this.loading.set(false);
              this.saved.emit();
            },
            error: () => this.loading.set(false)
          });
        },
        error: () => this.loading.set(false)
      });
    } else {
      // إضافة
      this.rolesService.create({
        name: this.form.name,
        description: this.form.description,
        permissionIds: this.selectedPermissionIds()
      }).subscribe({
        next: () => {
          this.loading.set(false);
          this.saved.emit();
        },
        error: () => this.loading.set(false)
      });
    }
  }

  cancel() { this.closed.emit(); }
}