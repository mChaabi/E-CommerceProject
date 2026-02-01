package com.example.BackEndE_Commerce.repository;

import com.example.BackEndE_Commerce.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Trouver toutes les commandes d'un utilisateur spécifique
    List<Order> findByUserId(Long userId);

    // Filtrer les commandes par statut (ex: PENDING, SHIPPED)
    List<Order> findByStatus(String status);

    // Trouver les commandes les plus récentes
    List<Order> findAllByOrderByOrderDateDesc();
}