import { Component, signal, computed } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { LucideDynamicIcon, LucidePlus } from '@lucide/angular';
import { Reveal } from '../../directives/reveal';

type TabKey = 'general' | 'technical';

@Component({
  selector: 'app-faq',
  imports: [TranslocoModule, LucideDynamicIcon, Reveal],
  templateUrl: './faq.html',
  styleUrl: './faq.scss'
})
export class Faq {
  activeTab = signal<TabKey>('general');
  openIndex = signal<number>(0);
  plusIcon = LucidePlus;

  tabs: { key: TabKey; label: string }[] = [
    { key: 'general', label: 'faq.tabs.general' },
    { key: 'technical', label: 'faq.tabs.technical' }
  ];

  private itemsByTab: Record<TabKey, { key: string }[]> = {
    general:   [{ key: 'q1' }, { key: 'q2' }, { key: 'q3' }],
    technical: [{ key: 'q4' }, { key: 'q5' }, { key: 'q6' }]
  };

  items = computed(() => this.itemsByTab[this.activeTab()]);

  switchTab(tab: TabKey) {
    if (this.activeTab() === tab) return;
    this.activeTab.set(tab);
    this.openIndex.set(0);
  }

  toggle(i: number) {
    this.openIndex.update(curr => curr === i ? -1 : i);
  }
}