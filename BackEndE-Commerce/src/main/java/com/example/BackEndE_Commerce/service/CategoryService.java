package com.example.BackEndE_Commerce.service;

import com.example.BackEndE_Commerce.dto.CategoryDTO;
import com.example.BackEndE_Commerce.entity.Category;
import com.example.BackEndE_Commerce.mapper.CategoryMapper;
import com.example.BackEndE_Commerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Génère le constructeur pour l'injection des dépendances (Lombok)
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Transactional
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = categoryMapper.toEntity(categoryDTO);

        Category savedCategory = categoryRepository.save(category);

        return categoryMapper.toDTO(savedCategory);
    }

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("La catégorie avec l'ID " + id + " n'existe pas.");
        }
        categoryRepository.deleteById(id);
    }
}
