import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './core/components/toast/toast';
import { ConfirmDialog } from './core/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, ConfirmDialog],
  template: `
    <router-outlet />
    <app-toast />
    <app-confirm-dialog />
  `
})
export class App {}