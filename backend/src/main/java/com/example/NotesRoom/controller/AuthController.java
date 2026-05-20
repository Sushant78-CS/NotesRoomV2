package com.example.NotesRoom.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.NotesRoom.dto.SyncUserDto;
import com.example.NotesRoom.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @GetMapping("/me")
    public String me(@AuthenticationPrincipal Jwt jwt) {
        return jwt.getSubject();
    }

    @PostMapping("/sync-user")
    public ResponseEntity<?> syncUser(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody SyncUserDto dto) {
        String clerkId = jwt.getSubject();
        userService.syncUser(clerkId, dto);
        return ResponseEntity.ok("User synced");
    }

    @GetMapping("/abc")
    public String greet() {
        return "Hello Sushant";
    }

}
