package com.example.BackEndE_Commerce.repository;

import com.example.BackEndE_Commerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Trouver un utilisateur par son nom d'utilisateur (pour le login)
    Optional<User> findByUsername(String username);

    // Trouver un utilisateur par son email
    Optional<User> findByEmail(String email);

    // Vérifier si un nom d'utilisateur existe déjà (pour l'inscription)
    Boolean existsByUsername(String username);

    // Vérifier si un email existe déjà
    Boolean existsByEmail(String email);
}