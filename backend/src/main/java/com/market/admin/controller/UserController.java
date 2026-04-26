package com.market.admin.controller;

import com.market.admin.service.UserService;
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
    private UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(Principal principal, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(userService.updateProfile(principal.getName(), body));
    }
}

