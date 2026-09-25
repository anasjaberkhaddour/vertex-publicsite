import { Component, input, output, signal, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../../core/services/users';
import { RolesService, RoleListItem } from '../../../../core/services/roles';
import { UserListItem, CreateUserRequest } from '../../../../core/models/user.models';

@Component({
  selector: 'app-user-form-dialog',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form-dialog.html',
  styleUrl: './user-form-dialog.scss'
})
export class UserFormDialog {
  private usersService = inject(UsersService);
  private rolesService = inject(RolesService);

  open = input<boolean>(false);
  user = input<UserListItem | null>(null);

  saved = output<void>();
  closed = output<void>();

  roles = signal<RoleListItem[]>([]);
  loading = signal(false);
  //error = signal<string | null>(null);

  form = {
    email: '',
    password: '',
    fullName: '',
    roles: [] as string[]
  };

  constructor() {
    // إعادة تعيين النموذج عند الفتح
    effect(() => {
      if (this.open()) {
        const u = this.user();
        if (u) {
          // وضع التعديل
          this.form = { email: u.email, password: '', fullName: u.fullName, roles: [...u.roles] };
        } else {
          // وضع الإضافة
          this.form = { email: '', password: '', fullName: '', roles: [] };
        }
      }
    });
  }

  ngOnInit() {
    this.rolesService.getAll().subscribe({
      next: r => this.roles.set(r),
    });
  }

  isEdit(): boolean {
    return !!this.user();
  }

  toggleRole(roleName: string) {
    const idx = this.form.roles.indexOf(roleName);
    if (idx >= 0) this.form.roles.splice(idx, 1);
    else this.form.roles.push(roleName);
  }

  isRoleSelected(roleName: string): boolean {
    return this.form.roles.includes(roleName);
  }

  submit(e: Event) {
    e.preventDefault();
    this.loading.set(true);
  
    const u = this.user();
  
    if (u) {
      this.usersService.update(u.id, { fullName: this.form.fullName, isActive: true })
        .subscribe({
          next: () => {
            this.usersService.updateRoles(u.id, { roles: this.form.roles }).subscribe({
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
      const req: CreateUserRequest = {
        email: this.form.email,
        password: this.form.password,
        fullName: this.form.fullName,
        roles: this.form.roles
      };
      this.usersService.create(req).subscribe({
        next: () => {
          this.loading.set(false);
          this.saved.emit();
        },
        error: () => this.loading.set(false)
      });
    }
  }

  cancel() {
    this.closed.emit();
  }
}