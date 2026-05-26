package com.smartretail.backend.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {
    public void sendPasswordResetEmail(String toEmail, String token) {
        System.out.println("=== RESET TOKEN for " + toEmail + " => " + token + " ===");
    }
}
