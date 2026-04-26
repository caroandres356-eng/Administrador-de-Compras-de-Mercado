package com.market.admin.controller;

import com.market.admin.dto.LoginRequest;
import com.market.admin.dto.RegisterRequest;
import com.market.admin.model.User;
import com.market.admin.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// esta clase devuelve objetos json al frontend y recibe objetos json del frontend
@RestController

// ruta base ara acceder a lso endpoints de este controlador
@RequestMapping("/api/auth")

@CrossOrigin(origins = "http://localhost:3000") // permite recibir peticionesd e este origen pero ya es redundante pr la
                                                // config global de SecurityConfig
public class AuthController {

    @Autowired // iyectamos dependencias
    private AuthService authService;

    @PostMapping("/register") // todos las peticiones post con endpoint /api/auth/register se dirigen a este
                              // metodo
    // metodoo que devuelve un objeto http que representa la respuesta a la peticion
    // completa
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        User user = User.builder()
                .email(request.getEmail())
                .password(request.getPassword()) // esto se pyede corregir
                .name(request.getName())
                .build();

        return ResponseEntity.ok(authService.register(user));// devuekv 200 ok, y llama al servicio para registrar ek
                                                             // usuario en la bd
    }

    @PostMapping("/login") // todas la speticiones post con endpoint /api/auth/login se dirigen a este
                           // metodo
    // deuvelve objeto http con respuesta a la peticion
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Map<String, Object> response = authService.login(request.getEmail(),
                    request.getPassword());

            return ResponseEntity.ok(response); // devuvuelve 200 ok , en el mapa envia el jwt y los datos del usuario
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }
    }
}
