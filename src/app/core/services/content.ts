import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SectionDto } from '../models/content.models';

export interface AdminSection {
  id: number;
  key: string;
  type?: string;
  order: number;
  isActive: boolean;
  title?: string;
  subTitle?: string;
  description?: string;
  blocksCount: number;
}

export interface AdminBlock {
  id: number;
  sectionId: number;
  key: string;
  type?: string;
  order: number;
  icon?: string;
  isFeatured: boolean;
  isActive: boolean;
  title?: string;
  subTitle?: string;
  description?: string;
  imagePath?: string;
  link?: string;
}

export interface UpdateSectionRequest {
  title?: string;
  subTitle?: string;
  description?: string;
  order: number;
  isActive: boolean;
}

export interface CreateBlockRequest {
  sectionId: number;
  key: string;
  type?: string;
  icon?: string;
  isFeatured: boolean;
  order: number;
  isActive: boolean;
  title?: string;
  subTitle?: string;
  description?: string;
  imagePath?: string;
  link?: string;
}

export interface UpdateBlockRequest {
  type?: string;
  icon?: string;
  isFeatured: boolean;
  order: number;
  isActive: boolean;
  title?: string;
  subTitle?: string;
  description?: string;
  imagePath?: string;
  link?: string;
}

@Injectable({ providedIn: 'root' })
export class ContentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/content`;

  sections = signal<SectionDto[]>([]);

  loadAll(lang: string): Observable<SectionDto[]> {
    return this.http.get<SectionDto[]>(`${this.apiUrl}/${lang}`)
      .pipe(tap(data => this.sections.set(data)));
  }

  getSection(key: string): SectionDto | undefined {
    return this.sections().find(s => s.key === key);
  }

  getBlock(sectionKey: string, blockKey: string) {
    return this.getSection(sectionKey)?.blocks.find(b => b.key === blockKey);
  }

  // ================= ADMIN =================

  getAdminSections(lang: string): Observable<AdminSection[]> {
    const params = new HttpParams().set('lang', lang);
    return this.http.get<AdminSection[]>(`${this.apiUrl}/admin/sections`, { params });
  }

  updateSection(id: number, lang: string, req: UpdateSectionRequest): Observable<void> {
    const params = new HttpParams().set('lang', lang);
    return this.http.put<void>(`${this.apiUrl}/admin/sections/${id}`, req, { params });
  }

  getAdminBlocks(sectionId: number, lang: string): Observable<AdminBlock[]> {
    const params = new HttpParams().set('lang', lang);
    return this.http.get<AdminBlock[]>(`${this.apiUrl}/admin/sections/${sectionId}/blocks`, { params });
  }

  createBlock(lang: string, req: CreateBlockRequest): Observable<{ blockId: number }> {
    const params = new HttpParams().set('lang', lang);
    return this.http.post<{ blockId: number }>(`${this.apiUrl}/admin/blocks`, req, { params });
  }

  updateBlock(id: number, lang: string, req: UpdateBlockRequest): Observable<void> {
    const params = new HttpParams().set('lang', lang);
    return this.http.put<void>(`${this.apiUrl}/admin/blocks/${id}`, req, { params });
  }

  deleteBlock(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/blocks/${id}`);
  }
}