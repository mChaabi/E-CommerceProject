package com.example.BackEndE_Commerce.mapper;

import com.example.BackEndE_Commerce.dto.ProductDTO;
import com.example.BackEndE_Commerce.entity.Product;
import com.example.BackEndE_Commerce.entity.Category;
import com.example.BackEndE_Commerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductMapper {

    private final CategoryRepository categoryRepository;

    public ProductDTO toDTO(Product product) {
        if (product == null) return null;

        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getOriginalPrice(),
                product.getColor(),
                product.getStockQuantity(),
                product.getCategory() != null ? product.getCategory().getId() : null
        );
    }

    public Product toEntity(ProductDTO dto) {
        if (dto == null) return null;

        Product product = new Product();
        product.setId(dto.id());
        product.setName(dto.name());
        product.setDescription(dto.description());
        product.setPrice(dto.price());
        product.setOriginalPrice(dto.originalPrice());
        product.setColor(dto.color());
        product.setStockQuantity(dto.stockQuantity());

        // Récupération de la catégorie depuis la BDD via l'ID du DTO
        if (dto.categoryId() != null) {
            Category category = categoryRepository.findById(dto.categoryId())
                    .orElseThrow(() -> new RuntimeException("Catégorie non trouvée pour l'id: " + dto.categoryId()));
            product.setCategory(category);
        }

        return product;
    }
}