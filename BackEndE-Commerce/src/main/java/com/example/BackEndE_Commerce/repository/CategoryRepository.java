package com.example.BackEndE_Commerce.repository;

import com.example.BackEndE_Commerce.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Vous pouvez ajouter des méthodes de recherche personnalisées ici
    // Exemple : trouver une catégorie par son nom
    Optional<Category> findByName(String name);
}
