import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule], // Plus besoin de CommonModule pour @for !
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css'
})
export class SidebarComponent {
  navItems = [
    { label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { label: 'Produits', icon: '📦', path: '/produits' },
    { label: 'Catégories', icon: '📁', path: '/categories' },
    { label: 'Commandes', icon: '📜', path: '/commandes' }
  ];
}
