/**
 * Paquete de seguridad de la aplicación.
 */
package com.market.admin.security;

// Importaciones de Jakarta EE para el manejo de servlets
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Importaciones de Spring Framework y Seguridad
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

// Importaciones de utilidades Java
import java.io.IOException;

/**
 * Filtro de seguridad que intercepta cada petición HTTP para validar el token JWT.
 * Extiende OncePerRequestFilter para garantizar que se ejecute solo una vez por cada solicitud.
 */
@Component // Indica que esta clase es un componente gestionado por Spring
public class JwtRequestFilter extends OncePerRequestFilter { // Clase que se encarga de filtrar las peticiones http y
                                                             // validar el token jwt

    @Autowired
    private UserDetailsServiceImpl userDetailsService; // Servicio que se encarga de cargar los datos del usuario

    @Autowired
    private JwtUtil jwtUtil; // Utilidad que se encarga de validar el token jwt

    /**
     * Intercepta la petición para comprobar la existencia y validez del token JWT en el encabezado Authorization.
     * 
     * @param request La petición HTTP.
     * @param response La respuesta HTTP.
     * @param chain La cadena de filtros.
     * @throws ServletException En caso de un error en el servlet.
     * @throws IOException En caso de un error de entrada/salida.
     */
    @Override // Sobrescribe el metodo doFilterInternal de la clase OncePerRequestFilter
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain chain)
            throws ServletException, IOException {

        // Obtiene el token jwt del header de la peticion
        final String authorizationHeader = request.getHeader("Authorization"); 

        String username = null;
        String jwt = null;

        // Verifica que el header sea valido y contenga el prefijo Bearer
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) { 
            jwt = authorizationHeader.substring(7); // Obtiene el token jwt excluyendo "Bearer "
            username = jwtUtil.extractUsername(jwt); // Obtiene el usuario del payload del token jwt
        }

        // Verifica que el usuario sea valido y que no exista ya una autenticación en el contexto
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) { 

            // Carga los datos del usuario desde la base de datos
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username); 

            // Verifica que el token jwt sea valido y corresponda al usuario
            if (jwtUtil.validateToken(jwt, userDetails)) { 

                // Crea el token de autenticación de Spring Security
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()); 
                // Establece los detalles de la solicitud en el token
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request)); 
                
                // Establece la autenticación en el contexto de seguridad para la sesión actual
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken); 
            }
        }
        // Continua con el siguiente filtro de la cadena
        chain.doFilter(request, response); 
    }
}
