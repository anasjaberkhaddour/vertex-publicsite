import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, Observable } from 'rxjs';
import { AuthService } from '../services/auth';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');

  const cloned = token && !isAuthRequest
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !isAuthRequest) {
        return handleRefresh(auth, req, next);
      }
      return throwError(() => err);
    })
  );
};

function handleRefresh(
  auth: AuthService,
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const refreshToken = auth.getRefreshToken();

  if (!refreshToken) {
    auth.logout();
    return throwError(() => new Error('No refresh token'));
  }

  if (isRefreshing) {
    return refreshTokenSubject.pipe(
      filter(t => t !== null),
      take(1),
      switchMap(newToken => {
        const cloned = req.clone({
          setHeaders: { Authorization: `Bearer ${newToken}` }
        });
        return next(cloned);
      })
    );
  }

  isRefreshing = true;
  refreshTokenSubject.next(null);

  return auth.refresh().pipe(
    switchMap(res => {
      isRefreshing = false;
      refreshTokenSubject.next(res.token);

      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${res.token}` }
      });
      return next(cloned);
    }),
    catchError(err => {
      isRefreshing = false;
      refreshTokenSubject.next(null);
      auth.logout();
      return throwError(() => err);
    })
  );
} 