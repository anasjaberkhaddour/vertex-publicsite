import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RoleListItem {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  usersCount: number;
  permissionsCount: number;
}

export interface RoleDetails {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  permissions: string[];
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissionIds: number[];
}

export interface UpdateRoleRequest {
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class RolesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/roles`;
  private permsUrl = `${environment.apiUrl}/permissions`;

  getAll(): Observable<RoleListItem[]> {
    return this.http.get<RoleListItem[]>(this.apiUrl);
  }

  getById(id: string): Observable<RoleDetails> {
    return this.http.get<RoleDetails>(`${this.apiUrl}/${id}`);
  }

  create(req: CreateRoleRequest): Observable<{ roleId: string }> {
    return this.http.post<{ roleId: string }>(this.apiUrl, req);
  }

  update(id: string, req: UpdateRoleRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, req);
  }

  assignPermissions(id: string, permissionIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/permissions`, { permissionIds });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.permsUrl);
  }
}