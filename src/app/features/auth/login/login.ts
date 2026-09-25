import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../../core/services/auth';
import { LoginRequest } from '../../../core/models/auth.models';

@Component({
  selector: 'app-login',
  imports: [FormsModule, TranslocoModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  credentials: LoginRequest = { email: '', password: '' };

  onSubmit(e: Event) {
    e.preventDefault();
    this.error.set(null);
    this.loading.set(true);

    this.auth.login(this.credentials).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'فشل تسجيل الدخول');
      }
    });
  }
}