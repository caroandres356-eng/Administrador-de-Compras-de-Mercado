package com.market.admin.service;

import com.market.admin.model.User;
import com.market.admin.repository.UserRepository;
import com.market.admin.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Servicio encargado de la lógica de autenticación y registro de usuarios.
 */
@Service
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
     * Registra un nuevo usuario cifrando su contraseña.
     * @param user Objeto usuario con los datos de registro.
     * @return El usuario guardado en la base de datos.
     */
    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    /**
     * Autentica a un usuario y genera un token JWT.
     * @param email Email del usuario.
     * @param password Contraseña plana del usuario.
     * @return Mapa con el token y datos básicos del perfil del usuario.
     */
    public Map<String, Object> login(String email, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        final UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        final String jwt = jwtUtil.generateToken(userDetails);
        
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found after authentication"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("user", Map.of(
            "name", user.getName(),
            "email", user.getEmail(),
            "avatar", user.getAvatar() != null ? user.getAvatar() : ""
        ));
        
        return response;
    }
}
