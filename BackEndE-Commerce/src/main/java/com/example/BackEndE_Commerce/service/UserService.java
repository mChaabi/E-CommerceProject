package com.example.BackEndE_Commerce.service;

import com.example.BackEndE_Commerce.dto.UserDTO;
import com.example.BackEndE_Commerce.entity.User;
import com.example.BackEndE_Commerce.mapper.UserMapper;
import com.example.BackEndE_Commerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    // AJOUTE CETTE LIGNE :
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;


    @Transactional
    public UserDTO registerUser(UserDTO userDTO) {
        // 1. Vérifier si le nom d'utilisateur existe déjà
        if (userRepository.existsByUsername(userDTO.username())) {
            throw new RuntimeException("Erreur : Ce nom d'utilisateur est déjà pris !");
        }

        // 2. Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(userDTO.email())) {
            throw new RuntimeException("Erreur : Cet email est déjà utilisé !");
        }

        // 3. Convertir en entité et sauvegarder
        User user = userMapper.toEntity(userDTO);

        // HACHAGE DU MOT DE PASSE
        user.setPassword(passwordEncoder.encode(userDTO.password()));

        // Note : Dans une vraie app, on encoderait le mot de passe ici (BCrypt)
        User savedUser = userRepository.save(user);

        return userMapper.toDTO(savedUser);
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + id));
        return userMapper.toDTO(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Impossible de supprimer : Utilisateur inexistant.");
        }
        userRepository.deleteById(id);
    }
}