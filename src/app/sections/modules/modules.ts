import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import {
  LucideUsers, LucideTarget, LucideClock, LucideWallet,
  LucideChartBar, LucideCalculator, LucideFactory, LucidePackage,
  LucideCar, LucideTrendingUp, LucideMessageSquare, LucideFileText,
  LucideSmartphone, LucideBuilding2, LucideSearch, LucideLock,
  LucideDynamicIcon
} from '@lucide/angular';
import { Reveal } from '../../directives/reveal';

@Component({
  selector: 'app-modules',
  imports: [TranslocoModule, LucideDynamicIcon, Reveal],
  templateUrl: './modules.html',
  styleUrl: './modules.scss'
})
export class Modules {
  modules = [
    { key: 'hr',           icon: LucideUsers },
    { key: 'recruitment',  icon: LucideTarget },
    { key: 'attendance',   icon: LucideClock },
    { key: 'payroll',      icon: LucideWallet },
    { key: 'finance',      icon: LucideChartBar },
    { key: 'costing',      icon: LucideCalculator },
    { key: 'production',   icon: LucideFactory },
    { key: 'inventory',    icon: LucidePackage },
    { key: 'garage',       icon: LucideCar },
    { key: 'performance',  icon: LucideTrendingUp },
    { key: 'messaging',    icon: LucideMessageSquare },
    { key: 'employeeFile', icon: LucideFileText },
    { key: 'mobileApp',    icon: LucideSmartphone },
    { key: 'entities',     icon: LucideBuilding2 },
    { key: 'auditLog',     icon: LucideSearch },
    { key: 'users',        icon: LucideLock }
  ];
}