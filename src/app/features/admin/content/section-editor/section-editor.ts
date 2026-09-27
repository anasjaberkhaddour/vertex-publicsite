import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { ContentService, AdminBlock, UpdateSectionRequest } from '../../../../core/services/content';
import { AuthService } from '../../../../core/services/auth';
import { ToastService } from '../../../../core/services/toast';
import { ConfirmService } from '../../../../core/services/confirm';
import { BlockFormDialog } from '../block-form-dialog/block-form-dialog';
import { LangService } from '../../../../core/services/lang';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-section-editor',
  imports: [CommonModule, FormsModule, RouterLink, BlockFormDialog, TranslocoModule],
  templateUrl: './section-editor.html',
  styleUrl: './section-editor.scss'
})
export class SectionEditor implements OnInit {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);
  private transloco = inject(TranslocoService);
  private toast = inject(ToastService);
  private confirm = inject(ConfirmService);
  private langService = inject(LangService);
  auth = inject(AuthService);

  loading = signal(true);
  sectionId = signal<number>(0);
  sectionKey = signal<string>('');
  blocks = signal<AdminBlock[]>([]);

  sectionForm = {
    title: '',
    subTitle: '',
    description: '',
    order: 0,
    isActive: true
  };
  savingSection = signal(false);

  showBlockDialog = signal(false);
  editingBlock = signal<AdminBlock | null>(null);

  get currentLang(): string {
    return this.langService.currentAdmin();
  }

  ngOnInit() {
    const key = this.route.snapshot.paramMap.get('key');
    if (!key) return;
    this.sectionKey.set(key);

    this.contentService.getAdminSections(this.currentLang).subscribe(sections => {
      const section = sections.find(s => s.key === key);
      if (!section) {
        this.loading.set(false);
        return;
      }

      this.sectionId.set(section.id);
      this.sectionForm = {
        title: section.title ?? '',
        subTitle: section.subTitle ?? '',
        description: section.description ?? '',
        order: section.order,
        isActive: section.isActive
      };

      this.loadBlocks();
    });

    this.transloco.langChanges$.subscribe(() => {
      this.reloadAll();
    });
  }

  reloadAll() {
    this.contentService.getAdminSections(this.currentLang).subscribe(sections => {
      const section = sections.find(s => s.key === this.sectionKey());
      if (!section) return;

      this.sectionForm = {
        title: section.title ?? '',
        subTitle: section.subTitle ?? '',
        description: section.description ?? '',
        order: section.order,
        isActive: section.isActive
      };
      this.loadBlocks();
    });
  }

  loadBlocks() {
    this.loading.set(true);
    this.contentService.getAdminBlocks(this.sectionId(), this.currentLang).subscribe({
      next: b => {
        this.blocks.set(b);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  saveSection() {
    const req: UpdateSectionRequest = {
      title: this.sectionForm.title,
      subTitle: this.sectionForm.subTitle,
      description: this.sectionForm.description,
      order: this.sectionForm.order,
      isActive: this.sectionForm.isActive
    };

    this.savingSection.set(true);
    this.contentService.updateSection(this.sectionId(), this.currentLang, req).subscribe({
      next: () => {
        this.savingSection.set(false);
        this.toast.success('admin.contentAdmin.sectionUpdated');
      },
      error: () => this.savingSection.set(false)
    });
  }

  can(permission: string): boolean {
    return this.auth.hasPermission(permission);
  }

  openCreateBlock() {
    this.editingBlock.set(null);
    this.showBlockDialog.set(true);
  }

  openEditBlock(b: AdminBlock) {
    this.editingBlock.set(b);
    this.showBlockDialog.set(true);
  }

  closeBlockDialog() {
    this.showBlockDialog.set(false);
    this.editingBlock.set(null);
  }

  onBlockSaved() {
    this.closeBlockDialog();
    this.loadBlocks();
  }

  async deleteBlock(b: AdminBlock) {
    const ok = await this.confirm.confirm({
      title: 'admin.contentAdmin.deleteBlockTitle',
      message: 'admin.contentAdmin.deleteBlockMessage',
      type: 'danger',
      confirmText: 'admin.common.delete'
    });
    if (!ok) return;

    this.contentService.deleteBlock(b.id).subscribe({
      next: () => {
        this.toast.success('admin.contentAdmin.blockDeleted');
        this.loadBlocks();
      }
    });
  }
}