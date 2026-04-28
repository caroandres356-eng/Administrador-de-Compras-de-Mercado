/**
 * Paquete de seguridad de la aplicación.
 */
package com.market.admin.security;

// Importaciones del modelo de usuario
import com.market.admin.model.User;
// Importaciones del repositorio de usuarios
import com.market.admin.repository.UserRepository;
// Importaciones de Spring Framework y Seguridad
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// Importaciones utilitarias
import java.util.ArrayList;

/**
 * Servicio que implementa UserDetailsService de Spring Security.
 * Encargado de cargar los datos de autenticación del usuario desde la base de datos.
 */
@Service // Indica que esta clase es un servicio gestionado por Spring
public class UserDetailsServiceImpl implements UserDetailsService { // Clase que implementa la interfaz UserDetailsService

    @Autowired // Inyecta el repositorio de usuarios
    private UserRepository userRepository;

    /**
     * Carga el usuario por su email para autenticarlo.
     * 
     * @param email El email del usuario (utilizado como nombre de usuario).
     * @return Un objeto UserDetails con las credenciales y roles del usuario.
     * @throws UsernameNotFoundException Si no se encuentra un usuario con ese email.
     */
    @Override // Sobrescribe el metodo loadUserByUsername de la interfaz UserDetailsService
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException { 
        // Busca el usuario en la base de datos mediante su email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email)); // Lanza excepción si no se encuentra

        // Retorna una instancia de UserDetails (User de Spring Security) con las credenciales del usuario
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),
                new ArrayList<>()); // Se envía una lista vacía de autoridades/roles por defecto
    }
}
