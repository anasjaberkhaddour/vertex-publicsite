import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import {
  LucideDynamicIcon, LucideMail, LucidePhone, LucideMapPin, LucideClock, LucideSend
} from '@lucide/angular';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, TranslocoModule, LucideDynamicIcon],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  submitted = signal(false);

  mailIcon = LucideMail;
  phoneIcon = LucidePhone;
  pinIcon = LucideMapPin;
  clockIcon = LucideClock;
  sendIcon = LucideSend;

  form = {
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  };

  onSubmit(e: Event) {
    e.preventDefault();
    // TODO: ربط الإرسال بـ backend لاحقاً
    console.log('Form submitted:', this.form);
    this.submitted.set(true);
  }
}