package com.example.BackEndE_Commerce.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatAiService {

    private final ChatClient chatClient;

    // Le Builder est automatiquement fourni par Spring AI
    public ChatAiService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String generation(String message) {
        return chatClient.prompt(message).call().content();
    }
}