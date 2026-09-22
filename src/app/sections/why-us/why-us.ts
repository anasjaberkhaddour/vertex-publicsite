import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import {
  LucideLayers, LucidePuzzle, LucideShieldCheck,
  LucideHeadphones, LucideLanguages, LucideZap,
  LucideDynamicIcon
} from '@lucide/angular';
import { Reveal } from '../../directives/reveal';

@Component({
  selector: 'app-why-us',
  imports: [TranslocoModule, LucideDynamicIcon, Reveal],
  templateUrl: './why-us.html',
  styleUrl: './why-us.scss'
})
export class WhyUs {
  features = [
    { key: 'integration',   icon: LucideLayers },
    { key: 'customization', icon: LucidePuzzle },
    { key: 'security',      icon: LucideShieldCheck },
    { key: 'support',       icon: LucideHeadphones },
    { key: 'arabic',        icon: LucideLanguages },
    { key: 'performance',   icon: LucideZap }
  ];
}