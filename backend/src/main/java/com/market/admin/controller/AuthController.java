/**
 * Paquete de controladores de la aplicación.
 */
package com.market.admin.controller;

// Importaciones de DTOs y Modelos
import com.market.admin.dto.LoginRequest;
import com.market.admin.dto.RegisterRequest;
import com.market.admin.model.User;
// Importaciones de Servicios
import com.market.admin.service.AuthService;
// Importaciones de Spring Framework web
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controlador REST que maneja la autenticación y registro de usuarios.
 * Esta clase devuelve objetos JSON al frontend y recibe objetos JSON del frontend.
 */
// esta clase devuelve objetos json al frontend y recibe objetos json del frontend
@RestController

// ruta base ara acceder a lso endpoints de este controlador
@RequestMapping("/api/auth")

@CrossOrigin(origins = "http://localhost:3000") // permite recibir peticionesd e este origen pero ya es redundante pr la
                                                // config global de SecurityConfig
public class AuthController {

    @Autowired // inyectamos dependencias
    private AuthService authService;

    /**
     * Maneja la solicitud de registro de un nuevo usuario.
     * 
     * @param request DTO que contiene la información de registro del usuario (email, password, nombre).
     * @return ResponseEntity con el usuario registrado o un error en caso de fallo.
     */
    @PostMapping("/register") // todos las peticiones post con endpoint /api/auth/register se dirigen a este
                              // metodo
    // metodoo que devuelve un objeto http que representa la respuesta a la peticion
    // completa
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Construimos la entidad de usuario a partir del DTO
        User user = User.builder()
                .email(request.getEmail())
                .password(request.getPassword()) // esto se puede corregir (encriptación en el servicio)
                .name(request.getName())
                .build();

        return ResponseEntity.ok(authService.register(user));// devueve 200 ok, y llama al servicio para registrar el
                                                             // usuario en la bd
    }

    /**
     * Maneja la solicitud de inicio de sesión (login) del usuario.
     * 
     * @param request DTO que contiene las credenciales de acceso (email, password).
     * @return ResponseEntity con el token JWT y los detalles del usuario si es exitoso, 
     *         o un error 401 si las credenciales son inválidas.
     */
    @PostMapping("/login") // todas la speticiones post con endpoint /api/auth/login se dirigen a este
                           // metodo
    // deuvelve objeto http con respuesta a la peticion
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Llama al servicio de autenticación y devuelve un mapa con el token
            Map<String, Object> response = authService.login(request.getEmail(),
                    request.getPassword());

            return ResponseEntity.ok(response); // devuelve 200 ok , en el mapa envia el jwt y los datos del usuario
        } catch (Exception e) {
            // Si hay excepción, significa que el usuario o clave son incorrectos
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }
    }
}
