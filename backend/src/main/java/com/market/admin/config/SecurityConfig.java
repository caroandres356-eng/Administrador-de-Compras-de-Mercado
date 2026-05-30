/**
 * Paquete de configuración de la aplicación.
 */
package com.market.admin.config;

// Importación del filtro personalizado para JWT
import com.market.admin.security.JwtRequestFilter;

// Importaciones de Spring Framework y Spring Security
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// Importaciones para la configuración de CORS
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Clase de configuración principal de seguridad para la aplicación.
 * Define la gestión de sesiones, reglas de autorización CORS y CSRF, 
 * además de registrar los filtros personalizados.
 */
// anotacion para denotar que esta clase contendra configuracion de seguridad
@Configuration
// anotacion para habilitar el framework de seguridad web de spring
@EnableWebSecurity
// clase normal de configuracion
public class SecurityConfig {

    // inyeccion de dependencias
    @Autowired
    // filtro personalizado que verifica el jwt de el header de cada peticion
    private JwtRequestFilter jwtRequestFilter;

    /**
     * Define el bean del codificador de contraseñas utilizando BCrypt.
     * 
     * @return Una instancia de PasswordEncoder (BCryptPasswordEncoder).
     */
    @Bean // crea objeto global par ausar en toda la aplicacion
    public PasswordEncoder passwordEncoder() {
        // devuelve objeto para encriptar contraseñas
        return new BCryptPasswordEncoder();
    }

    /**
     * Define el AuthenticationManager requerido para el proceso de inicio de sesión.
     * 
     * @param authenticationConfiguration Configuración inyectada de autenticación de Spring.
     * @return Una instancia de AuthenticationManager.
     * @throws Exception En caso de error de configuración.
     */
    @Bean // crea un ojbeto global para usar en toda la app
    // es un metodo que devuelve el manager de autenticacion que busca el usuario en
    // la base de datos , compara contraseña con bycrypt y autentica al usuario
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * Configura la cadena de filtros de seguridad (SecurityFilterChain).
     * Establece las políticas CORS/CSRF, reglas de autorización y añade el filtro JWT.
     * 
     * @param http Instancia de HttpSecurity para configurar la seguridad web.
     * @return La cadena de filtros configurada.
     * @throws Exception En caso de un error de configuración de la cadena.
     */
    @Bean // crea un objeto global para usar en toda la aplicacioj
    // construye la cadena de seguridad por la que va a pasar cada peticion http que
    // llega al servidor
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Deshabilitamos CSRF porque usamos JWT, no cookies.
                .csrf(csrf -> csrf.disable())

                // aplicamos la configuracion cors ue ya definimos abajo
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // configuracion de rutas
                .authorizeHttpRequests(auth -> auth
                        // Rutas que cualquiera puede acceder sin estar autenticado
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**", "/webjars/**")
                        .permitAll()
                        .requestMatchers("/error").permitAll()

                        // cualquier otra peticion a cualquier otro endpoint requiere autenticacion
                        .anyRequest().authenticated())

                // configuramos que cada sesion tenga su jwt independiente , y que el servidor
                // no guarde usuario
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Deshabilitamos iframes para permitir que la consola de H2 se pueda ver
                .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        // Añadimos nuestro filtro JWT ANTES del filtro estándar de autenticación de
        // Spring.
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Configura los orígenes permitidos (CORS) para interactuar con la API.
     * 
     * @return Configuración fuente basada en URL.
     */
    @Bean // crea un objeto global para usar en toda la aplicacion
    // configuracion que permite que se conecte el backend y el frontend
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // permite enviar datos sensibles como jwt cookies o headers de autheticacion
        config.setAllowCredentials(true);

        // permitir recibir peticiones de este origen el de react
        config.addAllowedOrigin("http://localhost:3000");

        // permitir cualquier header
        config.addAllowedHeader("*");

        // permitir cualquier metodo post, get, delete, update etc..
        config.addAllowedMethod("*");

        // aplicar esta configuracion a todas las rutas del sistema
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
