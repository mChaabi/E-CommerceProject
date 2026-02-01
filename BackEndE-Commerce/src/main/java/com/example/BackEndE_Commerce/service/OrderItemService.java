package com.example.BackEndE_Commerce.service;

import com.example.BackEndE_Commerce.dto.OrderItemDTO;
import com.example.BackEndE_Commerce.entity.OrderItem;
import com.example.BackEndE_Commerce.entity.Product;
import com.example.BackEndE_Commerce.mapper.OrderItemMapper;
import com.example.BackEndE_Commerce.repository.OrderItemRepository;
import com.example.BackEndE_Commerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final OrderItemMapper orderItemMapper;
    private final ProductRepository productRepository; // Indispensable pour le stock



    @Transactional(readOnly = true)
    public List<OrderItemDTO> getItemsByOrderId(Long orderId) {
        return orderItemRepository.findByOrderId(orderId)
                .stream()
                .map(orderItemMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderItemDTO updateQuantity(Long id, Integer newQuantity) {
        OrderItem item = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article de commande introuvable"));

        item.setQuantity(newQuantity);

        return orderItemMapper.toDTO(orderItemRepository.save(item));
    }

    @Transactional
    public void deleteOrderItem(Long id) {
        if (!orderItemRepository.existsById(id)) {
            throw new RuntimeException("Article introuvable");
        }
        orderItemRepository.deleteById(id);
    }
}