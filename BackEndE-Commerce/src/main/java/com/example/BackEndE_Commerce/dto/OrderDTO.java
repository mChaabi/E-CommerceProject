package com.example.BackEndE_Commerce.dto;

import java.time.LocalDateTime;
import java.util.List;

public record OrderDTO(
        Long id,
        LocalDateTime orderDate,
        String status,
        Double totalAmount,
        Long userId,
        List<OrderItemDTO> items
) {}