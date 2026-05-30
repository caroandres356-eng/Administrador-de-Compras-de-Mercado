/**
 * Paquete para la capa de servicios, donde reside la lógica de negocio.
 */
package com.market.admin.service;

// Importaciones de modelos y repositorios
import com.market.admin.model.User;
import com.market.admin.repository.UserRepository;
// Importaciones de seguridad
import com.market.admin.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

// Importaciones de utilidades Java
import java.util.HashMap;
import java.util.Map;

/**
 * Servicio encargado de la lógica de autenticación y registro de usuarios.
 * Interviene en el proceso de inicio de sesión, validación de credenciales y generación de JWT.
 */
@Service // Anotación que indica que esta clase es un servicio gestionado por Spring
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    /**
     * Registra un nuevo usuario en el sistema.
     * Toma la contraseña en texto plano, la cifra usando PasswordEncoder y guarda la entidad.
     * 
     * @param user Objeto usuario con los datos de registro (email, password, nombre).
     * @return El usuario guardado en la base de datos (con la contraseña cifrada).
     */
    public User register(User user) {
        // Cifra la contraseña antes de guardarla en la base de datos
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    /**
     * Autentica a un usuario verificando sus credenciales y genera un token JWT.
     * 
     * @param email    Email del usuario.
     * @param password Contraseña plana del usuario.
     * @return Mapa con el token generado y los datos básicos del perfil del usuario.
     */
    public Map<String, Object> login(String email, String password) {
        // Metodo para autenticar a un usuario y generar un token jwt
        
        // Autentica al usuario a través del AuthenticationManager de Spring Security
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        
        // Carga los datos del usuario requeridos para generar el token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        
        // Genera el token jwt usando la utilidad JwtUtil
        final String jwt = jwtUtil.generateToken(userDetails);

        // Obtiene el usuario completo de la base de datos para extraer sus datos de perfil
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found after authentication"));

        // Construye el mapa de respuesta
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt); // Agrega el token jwt al mapa
        response.put("user", Map.of( // Agrega los datos públicos del usuario al mapa
                "name", user.getName(),
                "email", user.getEmail(),
                "avatar", user.getAvatar() != null ? user.getAvatar() : ""));

        return response;
    }
}
