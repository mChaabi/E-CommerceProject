package com.example.BackEndE_Commerce.controller;

import com.example.BackEndE_Commerce.dto.OrderItemDTO;
import com.example.BackEndE_Commerce.service.OrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order-items")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class OrderItemController {

    private final OrderItemService orderItemService;


    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderItemDTO>> getItemsByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderItemService.getItemsByOrderId(orderId));
    }

    @PatchMapping("/{id}/quantity")
    public ResponseEntity<OrderItemDTO> updateQuantity(@PathVariable Long id, @RequestParam Integer quantity) {
        return ResponseEntity.ok(orderItemService.updateQuantity(id, quantity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        orderItemService.deleteOrderItem(id);
        return ResponseEntity.noContent().build();
    }
}