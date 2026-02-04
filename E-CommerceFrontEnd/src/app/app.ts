import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './components/sidebar-component/sidebar-component';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isSidebarOpen = false;

  constructor(private translate: TranslateService, private router: Router) {
    this.translate.setDefaultLang('fr');

    // Ferme la sidebar automatiquement après un clic sur un lien (mobile)
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isSidebarOpen = false;
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  changeLanguage(event: any) {
    const lang = event.target.value;
    this.translate.use(lang);
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    this.isSidebarOpen = false;
  }
}
