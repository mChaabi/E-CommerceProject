package com.example.BackEndE_Commerce.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record OrderItemDTO(
        Long id,
        Long productId,
        String productName,
        Integer quantity,

        @NotNull
        @DecimalMin("0.0")
        BigDecimal price // Prix au moment de l'achat
) {}