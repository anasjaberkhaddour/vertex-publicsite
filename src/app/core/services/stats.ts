import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DailyVisit {
  date: string;
  count: number;
}

export interface RecentMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRoles: number;
  totalMessages: number;
  unreadMessages: number;
  totalVisits: number;
  visitsToday: number;
  visitsThisWeek: number;
  uniqueVisitorsToday: number;
  visitsLast7Days: DailyVisit[];
  recentMessages: RecentMessage[];
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/stats`;

  getDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`);
  }
}