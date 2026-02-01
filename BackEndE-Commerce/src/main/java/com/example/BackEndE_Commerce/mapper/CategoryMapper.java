package com.example.BackEndE_Commerce.mapper;

import com.example.BackEndE_Commerce.dto.CategoryDTO;
import com.example.BackEndE_Commerce.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryDTO toDTO(Category category) {
        if (category == null) return null;

        return new CategoryDTO(
                category.getId(),
                category.getName(),
                category.getDescription()
        );
    }

    public Category toEntity(CategoryDTO dto) {
        if (dto == null) return null;

        Category category = new Category();
        category.setId(dto.id());
        category.setName(dto.name());
        category.setDescription(dto.description());
        return category;
    }
}
