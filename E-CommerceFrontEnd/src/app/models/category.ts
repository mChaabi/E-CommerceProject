import { Product } from './product';

export interface Category {
  id?: number;              // Optionnel car généré par la DB lors de l'ajout
  name: string;             // Correspond à 'name' en Java
  description?: string;      // Optionnel (peut être null)
  products?: Product[];      // Relation OneToMany
}
