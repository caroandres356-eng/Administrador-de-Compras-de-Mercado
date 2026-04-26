package com.market.admin.security;

import com.market.admin.model.User;
import com.market.admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service // Indica que esta clase es un servicio de spring
public class UserDetailsServiceImpl implements UserDetailsService { // Clase que implementa la interfaz
                                                                    // UserDetailsService

    @Autowired // Inyecta el repositorio de usuarios
    private UserRepository userRepository;

    @Override // Sobrescribe el metodo loadUserByUsername de la interfaz UserDetailsService
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException { // Metodo para cargar el
                                                                                           // usuario por email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email)); // Lanza una
                                                                                                          // excepcion
                                                                                                          // si el
                                                                                                          // usuario no
                                                                                                          // es
                                                                                                          // encontrado

        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),
                new ArrayList<>()); // Retorna el usuario con sus credenciales y roles
    }
}
