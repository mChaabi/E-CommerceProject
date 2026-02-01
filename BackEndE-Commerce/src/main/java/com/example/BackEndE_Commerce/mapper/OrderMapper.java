package com.example.BackEndE_Commerce.mapper;

import com.example.BackEndE_Commerce.dto.OrderDTO;
import com.example.BackEndE_Commerce.dto.OrderItemDTO;
import com.example.BackEndE_Commerce.entity.Order;
import com.example.BackEndE_Commerce.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public OrderDTO toDTO(Order order) {
        if (order == null) return null;

        List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(item -> new OrderItemDTO(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPrice()
                ))
                .collect(Collectors.toList());

        return new OrderDTO(
                order.getId(),
                order.getOrderDate(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getUser() != null ? order.getUser().getId() : null,
                itemDTOs
        );
    }

    // Note: Pour toEntity, on le gère souvent dans le Service car la création
    // d'une commande implique de vérifier le stock et de calculer les prix réels.
}