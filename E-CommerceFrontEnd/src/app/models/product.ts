import { Category } from './category';

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  originalPrice: number;
  color?: string;
  stockQuantity: number;

  // Dans le DTO, on envoie souvent l'ID de la catégorie pour la création
  categoryId?: number;

  // Et on reçoit l'objet Category complet pour l'affichage
  category?: Category;
}
