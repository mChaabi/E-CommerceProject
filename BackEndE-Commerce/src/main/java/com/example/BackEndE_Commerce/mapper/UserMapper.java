package com.example.BackEndE_Commerce.mapper;

import com.example.BackEndE_Commerce.dto.UserDTO;
import com.example.BackEndE_Commerce.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toDTO(User user) {
        if (user == null) return null;

        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                null, // Sécurité : On met le mot de passe à null dans le DTO de sortie
                user.getRole()
        );
    }

    public User toEntity(UserDTO dto) {
        if (dto == null) return null;

        User user = new User();
        user.setId(dto.id());
        user.setUsername(dto.username());
        user.setEmail(dto.email());
        user.setPassword(dto.password()); // Ici on récupère le mot de passe pour l'enregistrement
        user.setRole(dto.role() != null ? dto.role() : "CUSTOMER"); // Rôle par défaut

        return user;
    }
}