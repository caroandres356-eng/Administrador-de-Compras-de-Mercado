/**
 * Paquete de controladores de la aplicación.
 */
package com.market.admin.controller;

// Importaciones del servicio
import com.market.admin.service.UserService;
// Importaciones de Spring Framework
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Importaciones de seguridad y utilidades de Java
import java.security.Principal;
import java.util.Map;

/**
 * Controlador REST para la gestión de los usuarios.
 * Proporciona endpoints para que el usuario autenticado pueda gestionar y actualizar
 * su información de perfil.
 */
@RestController
@RequestMapping("/api/users") // Endpoint base para operaciones de usuario
@CrossOrigin(origins = "http://localhost:3000") // Configuración CORS específica del frontend
public class UserController {

    @Autowired // Inyecta el servicio de gestión de usuarios
    private UserService userService;

    /**
     * Actualiza el perfil del usuario actualmente autenticado.
     * 
     * @param principal Objeto inyectado por Spring Security con la información del usuario actual.
     * @param body Mapa que contiene los campos a actualizar en el perfil (ej. nombre, preferencias).
     * @return ResponseEntity con los datos actualizados del usuario en formato de mapa.
     */
    @PutMapping("/profile") // Maneja peticiones PUT en /api/users/profile
    public ResponseEntity<Map<String, Object>> updateProfile(Principal principal, @RequestBody Map<String, String> body) {
        // Llama al servicio para procesar la actualización enviando el email del principal y el cuerpo de la petición
        return ResponseEntity.ok(userService.updateProfile(principal.getName(), body));
    }
}
