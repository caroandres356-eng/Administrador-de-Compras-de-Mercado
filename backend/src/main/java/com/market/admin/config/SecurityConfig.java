package com.market.admin.config;

import com.market.admin.security.JwtRequestFilter;

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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

//anotacion para denotar que esta clase contendra configuracion de seguridad
@Configuration
// anotacion para habilitar el framework de seguridad web de spring
@EnableWebSecurity
// clase normal de configuracion
public class SecurityConfig {

    // inyeccion de dependencias
    @Autowired
    // filtro personalizado que verifica el jwt de el header de cada peticion
    private JwtRequestFilter jwtRequestFilter;

    @Bean // crea objeto global par ausar en toda la aplicacion
    public PasswordEncoder passwordEncoder() {
        // devuelve objeto para encriptar contraseñas
        return new BCryptPasswordEncoder();
    }

    @Bean // crea un ojbeto global para usar en toda la app
    // es un metodo que devuelve el manager de autenticacion que busca el usuario en
    // la base de datos , compara contraseña con bycrypt y autentica al usuario
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

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
