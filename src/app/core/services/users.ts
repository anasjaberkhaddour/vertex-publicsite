import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  UserListItem, UserDetails, CreateUserRequest,
  UpdateUserRequest, UpdateUserRolesRequest, ChangePasswordRequest,
  PagedResult
} from '../models/user.models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getAll(page = 1, pageSize = 10, search = ''): Observable<PagedResult<UserListItem>> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    return this.http.get<PagedResult<UserListItem>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${this.apiUrl}/${id}`);
  }

  create(req: CreateUserRequest): Observable<{ userId: string }> {
    return this.http.post<{ userId: string }>(this.apiUrl, req);
  }

  update(id: string, req: UpdateUserRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, req);
  }

  updateRoles(id: string, req: UpdateUserRolesRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/roles`, req);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  changePassword(req: ChangePasswordRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/change-password`, req);
  }

  resetPassword(id: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/reset-password`, { newPassword });
  }
}