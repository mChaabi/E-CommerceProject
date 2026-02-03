import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core'; // AJOUTER CECI

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, TranslateModule], // AJOUTER TranslateModule ici
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css'
})
export class SidebarComponent {
  // On utilise des CLÉS (ex: 'SIDEBAR.DASHBOARD') au lieu de texte fixe
  navItems = [
    { label: 'SIDEBAR.DASHBOARD', icon: '📊', path: '/dashboard' },
    { label: 'SIDEBAR.PRODUCTS', icon: '📦', path: '/produits' },
    { label: 'SIDEBAR.CATEGORIES', icon: '📁', path: '/categories' },
    { label: 'SIDEBAR.ORDERS', icon: '📜', path: '/commandes' }
  ];

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('fr');
  }

  // LA FONCTION QUI MANQUAIT
  changeLanguage(event: any) {
    const lang = event.target.value;
    this.translate.use(lang);

    // Gestion de la direction pour l'Arabe (RTL)
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }
}
