import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { StatsService, DashboardStats } from '../../../core/services/stats';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class AdminDashboard implements OnInit {
  private statsService = inject(StatsService);
  auth = inject(AuthService);

  loading = signal(true);
  stats = signal<DashboardStats | null>(null);

  maxVisit = () => Math.max(...(this.stats()?.visitsLast7Days.map(d => d.count) ?? [1]), 1);

  barHeight(count: number): number {
    return Math.max((count / this.maxVisit()) * 100, 4);
  }

  ngOnInit() {
    this.statsService.getDashboard().subscribe({
      next: s => {
        this.stats.set(s);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}