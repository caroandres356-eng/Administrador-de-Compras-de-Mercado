package com.market.admin.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import org.springframework.lang.NonNull;
import java.io.IOException;

@Component // Indica que esta clase es un componente de spring
public class JwtRequestFilter extends OncePerRequestFilter { // Clase que se encarga de filtrar las peticiones http y
                                                             // validar el token jwt

    @Autowired
    private UserDetailsServiceImpl userDetailsService; // Servicio que se encarga de cargar los datos del usuario

    @Autowired
    private JwtUtil jwtUtil; // Utilidad que se encarga de validar el token jwt

    @Override // Sobrescribe el metodo doFilterInternal de la clase OncePerRequestFilter
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization"); // Obtiene el token jwt del header de la
                                                                               // peticion

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) { // Verifica que el header sea
                                                                                        // valido
            jwt = authorizationHeader.substring(7); // Obtiene el token jwt
            username = jwtUtil.extractUsername(jwt); // Obtiene el usuario del token jwt
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) { // Verifica que el
                                                                                                  // usuario sea valido

            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username); // Carga los datos del
                                                                                            // usuario

            if (jwtUtil.validateToken(jwt, userDetails)) { // Verifica que el token jwt sea valido

                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()); // Crea un token jwt
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request)); // Establece los
                                                                                                 // detalles del token
                                                                                                 // jwt
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken); // Establece
                                                                                                           // el token
                                                                                                           // jwt en el
                                                                                                           // contexto
                                                                                                           // de
                                                                                                           // seguridad
            }
        }
        chain.doFilter(request, response); // Continua con el filtro
    }
}
