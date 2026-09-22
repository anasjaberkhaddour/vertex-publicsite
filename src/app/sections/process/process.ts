import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import {
  LucideDynamicIcon, LucideSearch, LucideSettings,
  LucideGraduationCap, LucideRocket
} from '@lucide/angular';
import { Reveal } from '../../directives/reveal';

@Component({
  selector: 'app-process',
  imports: [TranslocoModule, LucideDynamicIcon, Reveal],
  templateUrl: './process.html',
  styleUrl: './process.scss'
})
export class Process {
  steps = [
    { key: 's1', icon: LucideSearch },
    { key: 's2', icon: LucideSettings },
    { key: 's3', icon: LucideGraduationCap },
    { key: 's4', icon: LucideRocket }
  ];
}