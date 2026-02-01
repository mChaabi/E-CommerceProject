export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string; // Utilisé uniquement pour le register
  role: 'ADMIN' | 'CUSTOMER';
  // On ne charge pas forcément les orders ici pour ne pas alourdir l'objet
}
