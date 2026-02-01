package com.example.BackEndE_Commerce.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom du produit est obligatoire")
    private String name;

    private String description;

    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false)
    private Double price; // Prix de vente

    @NotNull(message = "Le prix d'origine est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false)
    private Double originalPrice; // prix_origine

    private String color; // Couleur

    @Min(value = 0, message = "Le stock ne peut pas être négatif")
    private Integer stockQuantity;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @NotNull(message = "La catégorie est obligatoire")
    private Category category;
}
