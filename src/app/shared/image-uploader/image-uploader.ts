import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { UploadService } from '../../core/services/upload';
import { ToastService } from '../../core/services/toast';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-image-uploader',
  imports: [CommonModule, TranslocoModule],
  templateUrl: './image-uploader.html',
  styleUrl: './image-uploader.scss'
})
export class ImageUploader {
  private uploadService = inject(UploadService);
  private toast = inject(ToastService);

  value = input<string>('');           // المسار الحالي
  changed = output<string>();          // يُرسل المسار الجديد

  uploading = signal(false);
  dragOver = signal(false);

  get previewUrl(): string {
    const v = this.value();
    if (!v) return '';
    // إذا كان مساراً نسبياً، أضف الـ API base
    if (v.startsWith('http')) return v;
    return `${environment.apiUrl.replace('/api', '')}${v}`;
  }

  selectFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/webp,image/svg+xml';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) this.upload(file);
    };
    input.click();
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragOver.set(false);

    const file = e.dataTransfer?.files?.[0];
    if (file) this.upload(file);
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.dragOver.set(true);
  }

  onDragLeave() {
    this.dragOver.set(false);
  }

  private upload(file: File) {
    // التحقق قبل الإرسال
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      this.toast.error('admin.contentAdmin.imageTooLarge');
      return;
    }

    this.uploading.set(true);
    this.uploadService.uploadImage(file).subscribe({
      next: (res) => {
        this.uploading.set(false);
        this.changed.emit(res.path);
        this.toast.success('admin.contentAdmin.imageUploaded');
      },
      error: () => this.uploading.set(false)
    });
  }

  remove(event: Event) {
    event.stopPropagation();
    this.changed.emit('');
  }
}