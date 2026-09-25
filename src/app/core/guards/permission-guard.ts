import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const required = route.data?.['permission'] as string | undefined;
  if (!required) return true;

  if (auth.hasPermission(required)) return true;

  router.navigate(['/admin']);
  return false;
};