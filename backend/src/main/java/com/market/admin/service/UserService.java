package com.market.admin.service;

import com.market.admin.model.User;
import com.market.admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> updateProfile(String email, Map<String, String> body) { // Actualiza el perfil del
                                                                                       // usuario
        User user = userRepository.findByEmail(email)// Busca el usuario por email
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (body.containsKey("name") && !body.get("name").isBlank()) {// Verifica que el body contenga un nombre y que
                                                                      // no esté vacío
            user.setName(body.get("name"));
        }
        if (body.containsKey("avatar")) {
            user.setAvatar(body.get("avatar"));
        }

        userRepository.save(user);

        return Map.of(
                "name", user.getName() != null ? user.getName() : "",
                "email", user.getEmail(),
                "avatar", user.getAvatar() != null ? user.getAvatar() : "");
    }
}
