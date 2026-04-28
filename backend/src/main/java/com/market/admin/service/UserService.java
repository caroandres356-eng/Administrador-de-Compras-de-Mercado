/**
 * Paquete para la capa de servicios, donde reside la lógica de negocio.
 */
package com.market.admin.service;

// Importaciones de modelos y repositorios
import com.market.admin.model.User;
import com.market.admin.repository.UserRepository;
// Importaciones de Spring Framework
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// Importaciones utilitarias
import java.util.Map;

/**
 * Servicio encargado de la gestión de perfiles de usuario.
 * Maneja la lógica de negocio para la lectura y actualización de los datos del usuario.
 */
@Service // Indica que es un componente de servicio administrado por Spring
public class UserService {

    @Autowired // Inyecta el repositorio de usuarios
    private UserRepository userRepository;

    /**
     * Actualiza el perfil de un usuario existente.
     * Permite modificar el nombre y/o el avatar del usuario.
     * 
     * @param email Correo electrónico del usuario (identificador de la sesión).
     * @param body Mapa que contiene los campos a actualizar (name, avatar).
     * @return Un mapa con los datos actualizados del perfil.
     */
    public Map<String, Object> updateProfile(String email, Map<String, String> body) { // Actualiza el perfil del usuario
        
        // Busca el usuario por email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verifica que el body contenga un nombre y que no esté vacío antes de actualizarlo
        if (body.containsKey("name") && !body.get("name").isBlank()) {
            user.setName(body.get("name"));
        }
        
        // Verifica si se envió un nuevo avatar para actualizarlo
        if (body.containsKey("avatar")) {
            user.setAvatar(body.get("avatar"));
        }

        // Persiste los cambios en la base de datos
        userRepository.save(user);

        // Retorna un objeto con la información pública actualizada
        return Map.of(
                "name", user.getName() != null ? user.getName() : "",
                "email", user.getEmail(),
                "avatar", user.getAvatar() != null ? user.getAvatar() : "");
    }
}
