package com.example.BackEndE_Commerce.controller;

import com.example.BackEndE_Commerce.service.ChatAiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatAiController {

    private final ChatAiService aiService;

    public ChatAiController(ChatAiService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/ai/generate")
    public String generate(@RequestParam(value = "message") String message) {
        return aiService.generation(message);
    }
}