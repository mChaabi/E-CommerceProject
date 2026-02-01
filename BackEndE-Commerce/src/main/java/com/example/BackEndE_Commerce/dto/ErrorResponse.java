package com.example.BackEndE_Commerce.dto;

public record ErrorResponse(
        int status,
        String message,
        long timestamp
) {}