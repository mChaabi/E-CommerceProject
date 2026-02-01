package com.example.BackEndE_Commerce.repository;

import com.example.BackEndE_Commerce.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Récupérer tous les articles liés à une commande spécifique
    List<OrderItem> findByOrderId(Long orderId);

    // Trouver combien de fois un produit spécifique a été vendu
    List<OrderItem> findByProductId(Long productId);
}