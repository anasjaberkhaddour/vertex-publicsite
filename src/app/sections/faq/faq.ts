import { Component, inject, computed, signal, effect } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { LucideDynamicIcon, LucidePlus } from '@lucide/angular';
import { Reveal } from '../../directives/reveal';
import { ContentService } from '../../core/services/content';

@Component({
  selector: 'app-faq',
  imports: [TranslocoModule, LucideDynamicIcon, Reveal],
  templateUrl: './faq.html',
  styleUrl: './faq.scss'
})
export class Faq {
  private contentService = inject(ContentService);

  section = computed(() => this.contentService.getSection('faq'));

  tabs = computed(() => {
    const blocks = this.section()?.blocks ?? [];
    const types = [...new Set(blocks.map(b => b.type).filter(Boolean))] as string[];
    return types.map(t => ({
      key: t,
      label: t === 'general' ? 'faq.tabs.general' : 'faq.tabs.technical'
    }));
  });

  activeTab = signal<string>('');
  openIndex = signal<number>(0);
  plusIcon = LucidePlus;

  items = computed(() => {
    const blocks = this.section()?.blocks ?? [];
    const tab = this.activeTab();
    if (!tab) return [];
    return blocks.filter(b => b.type === tab);
  });

  constructor() {
    // عندما تُحمَّل التبويبات لأول مرة، فعّل الأولى
    effect(() => {
      const tabs = this.tabs();
      if (tabs.length > 0 && !this.activeTab()) {
        this.activeTab.set(tabs[0].key);
      }
    });
  }

  switchTab(tab: string) {
    if (this.activeTab() === tab) return;
    this.activeTab.set(tab);
    this.openIndex.set(0);
  }

  toggle(i: number) {
    this.openIndex.update(curr => curr === i ? -1 : i);
  }
}