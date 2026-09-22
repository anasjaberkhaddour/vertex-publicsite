import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Hero } from './sections/hero/hero';
import { Modules } from './sections/modules/modules';
import { Screenshots } from './sections/screenshots/screenshots';
import { WhyUs } from './sections/why-us/why-us';
import { Process } from './sections/process/process';
import { Faq } from './sections/faq/faq';
import { Cta } from './sections/cta/cta';
import { Contact } from './sections/contact/contact';
import { Footer } from './layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Hero, Modules, Screenshots, WhyUs, Process, Faq, Cta, Contact, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}