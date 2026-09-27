import { Component, input, output, signal, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  ContentService, AdminBlock,
  CreateBlockRequest, UpdateBlockRequest
} from '../../../../core/services/content';
import { ALL_ICON_NAMES } from '../../../../core/utils/icon-map';
import { TranslocoModule } from '@jsverse/transloco';
import { ToastService } from '../../../../core/services/toast';
import { ImageUploader } from '../../../../shared/image-uploader/image-uploader';

interface BlockTypeItem {
  value: string;
  label: string;
  labelEn: string;
}

interface BlockTypeGroup {
  label: string;
  labelEn: string;
  items: BlockTypeItem[];
}

interface BlockTypesConfig {
  groups: BlockTypeGroup[];
}

@Component({
  selector: 'app-block-form-dialog',
  imports: [CommonModule, FormsModule, TranslocoModule, ImageUploader],
  templateUrl: './block-form-dialog.html',
  styleUrl: './block-form-dialog.scss'
})
export class BlockFormDialog implements OnInit {
  private contentService = inject(ContentService);
  private toast = inject(ToastService);
  private http = inject(HttpClient);

  open = input<boolean>(false);
  block = input<AdminBlock | null>(null);
  sectionId = input<number>(0);
  lang = input<string>('ar');

  saved = output<void>();
  closed = output<void>();

  loading = signal(false);
  iconNames = ALL_ICON_NAMES;
  blockTypes = signal<BlockTypesConfig | null>(null);

  form = {
    key: '',
    type: '',
    icon: '',
    isFeatured: false,
    order: 0,
    isActive: true,
    title: '',
    subTitle: '',
    description: '',
    imagePath: '',
    link: ''
  };

  constructor() {
    effect(() => {
      if (this.open()) {
        const b = this.block();
        if (b) {
          this.form = {
            key: b.key,
            type: b.type ?? '',
            icon: b.icon ?? '',
            isFeatured: b.isFeatured,
            order: b.order,
            isActive: b.isActive,
            title: b.title ?? '',
            subTitle: b.subTitle ?? '',
            description: b.description ?? '',
            imagePath: b.imagePath ?? '',
            link: b.link ?? ''
          };
        } else {
          this.form = {
            key: '',
            type: '',
            icon: '',
            isFeatured: false,
            order: 0,
            isActive: true,
            title: '',
            subTitle: '',
            description: '',
            imagePath: '',
            link: ''
          };
        }
      }
    });
  }

  ngOnInit() {
    this.http.get<BlockTypesConfig>('/config/block-types.json')
      .subscribe(t => this.blockTypes.set(t));
  }

  isEdit(): boolean { return !!this.block(); }

  submit(e: Event) {
    e.preventDefault();
    this.loading.set(true);

    const b = this.block();
    if (b) {
      const req: UpdateBlockRequest = {
        type: this.form.type || undefined,
        icon: this.form.icon || undefined,
        isFeatured: this.form.isFeatured,
        order: this.form.order,
        isActive: this.form.isActive,
        title: this.form.title,
        subTitle: this.form.subTitle || undefined,
        description: this.form.description || undefined,
        imagePath: this.form.imagePath || undefined,
        link: this.form.link || undefined
      };
      this.contentService.updateBlock(b.id, this.lang(), req).subscribe({
        next: () => {
          this.loading.set(false);
          this.toast.success('admin.contentAdmin.blockUpdated');
          this.saved.emit();
        },
        error: () => this.loading.set(false)
      });
    } else {
      const req: CreateBlockRequest = {
        sectionId: this.sectionId(),
        key: this.generateKey(this.form.title),  // ← توليد تلقائي
        type: this.form.type || undefined,
        icon: this.form.icon || undefined,
        isFeatured: this.form.isFeatured,
        order: this.form.order,
        isActive: this.form.isActive,
        title: this.form.title,
        subTitle: this.form.subTitle || undefined,
        description: this.form.description || undefined,
        imagePath: this.form.imagePath || undefined,
        link: this.form.link || undefined
      };
      this.contentService.createBlock(this.lang(), req).subscribe({
        next: () => {
          this.loading.set(false);
          this.toast.success('admin.contentAdmin.blockCreated');
          this.saved.emit();
        },
        error: () => this.loading.set(false)
      });
    }
  }
  private generateKey(title: string): string {
    // حوّل العنوان إلى slug
    const base = title
      .trim()
      .toLowerCase()
      .replace(/[^\w\u0600-\u06FF]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 40);
  
    // أضف timestamp مختصر لضمان التفرّد
    const suffix = Date.now().toString(36).slice(-5);
    return `${base || 'block'}-${suffix}`;
  }
  cancel() { this.closed.emit(); }
}