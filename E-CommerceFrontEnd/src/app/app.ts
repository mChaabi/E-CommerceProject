import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar-component/sidebar-component';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('fr');
  }

  changeLanguage(event: any) {
    const lang = event.target.value;
    this.translate.use(lang);

    // Changement automatique de la direction du système
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl'; // Tout le système passe à droite
    } else {
      document.documentElement.dir = 'ltr'; // Mode normal à gauche
    }
  }
  protected readonly title = signal('E-CommerceFrontEnd');
}
