import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VisitService {
  private http = inject(HttpClient);
  private SESSION_KEY = 'vertex_visit_tracked';

  trackVisit() {
    if (sessionStorage.getItem(this.SESSION_KEY)) return;

    this.http.post(`${environment.apiUrl}/visits`, {}).subscribe({
      next: () => sessionStorage.setItem(this.SESSION_KEY, '1'),
      error: () => {
        // فشل صامت — لا نُزعج الزائر
      }
    });
  }
}