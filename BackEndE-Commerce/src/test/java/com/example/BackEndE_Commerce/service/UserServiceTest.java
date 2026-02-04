package com.example.BackEndE_Commerce.service;

import com.example.BackEndE_Commerce.dto.UserDTO;
import com.example.BackEndE_Commerce.entity.User;
import com.example.BackEndE_Commerce.mapper.UserMapper;
import com.example.BackEndE_Commerce.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UserDTO userDTO;
    private User user;

    @BeforeEach
    void setUp() {
        // Préparation des données de test
        userDTO = new UserDTO(null, "testuser", "test@email.com", "password123", "USER");
        user = new User();
        user.setUsername("testuser");
        user.setEmail("test@email.com");
    }

    // SCÉNARIO 1 : SUCCÈS - Enregistrement d'un nouvel utilisateur
    @Test
    void shouldRegisterUserSuccessfully() {
        // Given (Préparation des simulations)
        when(userRepository.existsByUsername(userDTO.username())).thenReturn(false);
        when(userRepository.existsByEmail(userDTO.email())).thenReturn(false);
        when(userMapper.toEntity(userDTO)).thenReturn(user);
        when(passwordEncoder.encode(userDTO.password())).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toDTO(user)).thenReturn(userDTO);

        // When (Exécution)
        UserDTO result = userService.registerUser(userDTO);

        // Then (Vérifications)
        assertNotNull(result);
        assertEquals("testuser", result.username());
        verify(passwordEncoder).encode("password123"); // Vérifie que le mot de passe a été haché
        verify(userRepository).save(any(User.class)); // Vérifie que l'utilisateur a été sauvegardé
    }

    // SCÉNARIO 2 : ÉCHEC - Email déjà utilisé
    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {
        // Given
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(userDTO.email())).thenReturn(true); // L'email existe déjà

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.registerUser(userDTO);
        });

        assertEquals("Erreur : Cet email est déjà utilisé !", exception.getMessage());
        verify(userRepository, never()).save(any(User.class)); // Vérifie qu'on n'a JAMAIS sauvegardé
    }
}