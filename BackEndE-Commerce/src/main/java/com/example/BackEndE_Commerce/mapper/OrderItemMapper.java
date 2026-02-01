package com.example.BackEndE_Commerce.mapper;

import com.example.BackEndE_Commerce.dto.OrderItemDTO;
import com.example.BackEndE_Commerce.entity.OrderItem;
import com.example.BackEndE_Commerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class OrderItemMapper {

    private final ProductRepository productRepository;
    
    public OrderItemDTO toDTO(OrderItem item) {
        if (item == null) return null;

        return new OrderItemDTO(
                item.getId(),
                item.getProduct() != null ? item.getProduct().getId() : null,
                item.getProduct() != null ? item.getProduct().getName() : null,
                item.getQuantity(),
                // Simple et propre si les deux sont en BigDecimal
                item.getPrice() != null ? item.getPrice() : BigDecimal.ZERO
        );
    }
    
    public OrderItem toEntity(OrderItemDTO dto) {
        if (dto == null) return null;

        OrderItem item = new OrderItem();
        item.setId(dto.id());
        item.setQuantity(dto.quantity());

        // Conversion de BigDecimal (DTO) vers Double (Entity)
        if (dto.price() != null) {
            item.setPriceAtPurchase(BigDecimal.valueOf(dto.price().doubleValue()));
        }

        // On récupère le produit depuis la base de données
        if (dto.productId() != null) {
            item.setProduct(productRepository.findById(dto.productId())
                    .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'ID : " + dto.productId())));
        }

        return item;
    }
}