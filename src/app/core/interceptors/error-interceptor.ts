import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast';
import { AuthService } from '../services/auth';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      let message = 'حدث خطأ غير متوقع';

      // 1. رسالة من الـ Backend (message)
      if (err.error?.message) {
        message = err.error.message;
      }
      // 2. مصفوفة errors (Identity)
      else if (Array.isArray(err.error?.errors)) {
        message = err.error.errors.join(' • ');
      }
      // 3. مصفوفة مباشرة
      else if (Array.isArray(err.error)) {
        message = err.error.join(' • ');
      }
      // 4. رسائل حسب رمز الحالة
      else {
        switch (err.status) {
          case 0:
            message = 'تعذّر الاتصال بالخادم. تحقق من الشبكة.';
            break;
          case 400:
            message = 'طلب غير صحيح.';
            break;
          case 401:
            message = 'انتهت الجلسة. الرجاء تسجيل الدخول مجدداً.';
            auth.logout();
            break;
          case 403:
            message = 'ليس لديك صلاحية للقيام بهذا الإجراء.';
            break;
          case 404:
            message = 'العنصر المطلوب غير موجود.';
            break;
          case 500:
          case 502:
          case 503:
            message = 'خطأ في الخادم. حاول مرة أخرى لاحقاً.';
            break;
        }
      }

      // تجاهل إشعار 401 لأنه يعالج بـ logout
      if (err.status !== 401) {
        toast.error(message);
      }

      return throwError(() => err);
    })
  );
};