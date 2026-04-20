package com.market.admin.controller;

import com.market.admin.model.User;
import com.market.admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(Principal principal, @RequestBody Map<String, String> body) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (body.containsKey("name") && !body.get("name").isBlank()) {
            user.setName(body.get("name"));
        }
        if (body.containsKey("avatar")) {
            user.setAvatar(body.get("avatar"));
        }
        userRepository.save(user);
        return ResponseEntity.ok(Map.of(
            "name", user.getName() != null ? user.getName() : "",
            "email", user.getEmail(),
            "avatar", user.getAvatar() != null ? user.getAvatar() : ""
        ));
    }
}
