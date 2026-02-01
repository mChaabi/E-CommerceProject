package com.example.BackEndE_Commerce.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductDTO(
        Long id,

        @NotBlank(message = "Le nom du produit est obligatoire")
        String name,

        String description,

        @NotNull(message = "Le prix est obligatoire")
        @DecimalMin(value = "0.0", inclusive = false, message = "Le prix doit être supérieur à 0")
        Double price,

        @NotNull(message = "Le prix d'origine est obligatoire")
        @DecimalMin(value = "0.0", inclusive = false, message = "Le prix d'origine doit être supérieur à 0")
        Double originalPrice,

        String color,

        @Min(value = 0, message = "Le stock ne peut pas être négatif")
        Integer stockQuantity,

        @NotNull(message = "L'ID de la catégorie est obligatoire")
        Long categoryId // On utilise l'ID pour simplifier les échanges API
) {}