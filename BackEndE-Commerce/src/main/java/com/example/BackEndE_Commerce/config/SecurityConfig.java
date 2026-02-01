package com.example.BackEndE_Commerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(withDefaults())
                .authorizeHttpRequests(auth -> auth
                        // 1. Accès public
                        .requestMatchers("/users/register").permitAll()
                        .requestMatchers( "/products/**").permitAll()
                        .requestMatchers("/categories/**").permitAll()
                        .requestMatchers("/orders/**").permitAll()
                        .requestMatchers("/order-items/**").permitAll()
                        // 2. Accès restreint (Remplacer le pattern invalide)
                        .requestMatchers("/orders/**", "/order-items/**").authenticated()

                        // On remplace /**/delete/** par les patterns spécifiques
                        .requestMatchers(HttpMethod.DELETE, "/users/delete/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/products/delete/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/categories/delete/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/orders/delete/**").authenticated()

                        // Tout le reste
                        .anyRequest().authenticated()
                )
                .httpBasic(withDefaults());

        return http.build();
    }
}