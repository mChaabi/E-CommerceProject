package com.example.BackEndE_Commerce.repository;

import com.example.BackEndE_Commerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Trouver tous los produits d'une catégorie spécifique
    List<Product> findByCategoryId(Long categoryId);

    // Rechercher des produits par nom (contient une chaîne de caractères)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Trouver les produits dont le stock est inférieur à un certain seuil
    List<Product> findByStockQuantityLessThan(Integer threshold);

    // Trouver les produits dans une fourchette de prix
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);
}