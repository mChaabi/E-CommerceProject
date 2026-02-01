package com.example.BackEndE_Commerce.service;

import com.example.BackEndE_Commerce.dto.OrderDTO;
import com.example.BackEndE_Commerce.entity.Order;
import com.example.BackEndE_Commerce.entity.OrderItem;
import com.example.BackEndE_Commerce.entity.Product;
import com.example.BackEndE_Commerce.mapper.OrderMapper;
import com.example.BackEndE_Commerce.repository.OrderRepository;
import com.example.BackEndE_Commerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    @Transactional
    public Order createOrder(Order order) {
        // 1. Calculer le montant total et lier les items à la commande
        double total = 0;

        for (OrderItem item : order.getItems()) {
            // Récupérer le produit en base de données
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Produit non trouvé : " + item.getProduct().getId()));

            // 2. Vérifier si le stock est suffisant
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException("Stock insuffisant pour le produit : " + product.getName());
            }

            // 3. Réduire le stock du produit
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);

            // 4. Préparer l'item (lier l'entité commande et fixer le prix actuel)
            item.setOrder(order);
            item.setPriceAtPurchase(BigDecimal.valueOf(product.getPrice()));
            total += product.getPrice() * item.getQuantity();
        }

        order.setTotalAmount(total);
        order.setOrderDate(LocalDateTime.now());

        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId)
                .stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
        order.setStatus(status);
        orderRepository.save(order);
    }

    @Transactional
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Impossible de supprimer : Commande inexistante (ID: " + id + ")");
        }
        orderRepository.deleteById(id);
    }


    @Transactional
    public OrderDTO updateOrder(Long id, OrderDTO orderDTO) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable avec l'ID : " + id));

        // On met à jour les champs autorisés
        if (orderDTO.status() != null) {
            existingOrder.setStatus(orderDTO.status());
        }
        if (orderDTO.totalAmount() != null) {
            existingOrder.setTotalAmount(orderDTO.totalAmount());
        }

        Order updatedOrder = orderRepository.save(existingOrder);
        return orderMapper.toDTO(updatedOrder);
    }
}