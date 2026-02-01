package com.example.BackEndE_Commerce.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserDTO(
        Long id,

        @NotBlank(message = "Le nom d'utilisateur est obligatoire")
        String username,

        @Email(message = "Email invalide")
        @NotBlank(message = "L'email est obligatoire")
        String email,

        @Size(min = 6, message = "Le mot de passe doit faire au moins 6 caractères")
        String password, // Utilisé uniquement pour l'inscription/connexion

        String role
) {}