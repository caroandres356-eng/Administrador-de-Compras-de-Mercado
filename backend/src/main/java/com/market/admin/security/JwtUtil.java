/**
 * Paquete de seguridad de la aplicación.
 */
package com.market.admin.security;

// Importaciones de la librería JJWT para el manejo de JSON Web Tokens
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
// Importaciones de Spring Framework
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

// Importaciones de utilidades Java
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Clase utilitaria para la generación, validación y extracción de datos de tokens JWT.
 */
@Service // Indica que esta clase es un servicio de Spring
public class JwtUtil {

    // Inyecta el valor de la propiedad market.jwt.secret del archivo application.properties
    @Value("${market.jwt.secret}") 
    private String secret;

    // Inyecta el valor de la propiedad market.jwt.expiration del archivo application.properties
    @Value("${market.jwt.expiration}") 
    private Long jwtExpiration;

    /**
     * Extrae el nombre de usuario (subject) del token JWT.
     * 
     * @param token El token JWT.
     * @return El nombre de usuario.
     */
    // Metodo para extraer el nombre de usuario del token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extrae la fecha de expiración del token JWT.
     * 
     * @param token El token JWT.
     * @return La fecha de expiración.
     */
    // Metodo para extraer la fecha de expiracion del token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extrae un claim específico del payload del token JWT.
     * 
     * @param token El token JWT.
     * @param claimsResolver Función para resolver el claim deseado.
     * @param <T> El tipo del claim.
     * @return El valor del claim.
     */
    // Metodo para extraer cualquier tipo de claim del token del payload
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims); // sacar un dato en especifico del claim pasando una funcion como parametro
    }

    /**
     * Extrae todos los claims del token descifrando la firma.
     * 
     * @param token El token JWT.
     * @return El objeto Claims con todo el payload.
     */
    // Metodo para extraer todos los claims del token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getSignInKey()).build().parseClaimsJws(token).getBody();
    }

    /**
     * Verifica si el token ha expirado.
     * 
     * @param token El token JWT.
     * @return true si ha expirado, false de lo contrario.
     */
    // Metodo para verificar si el token ha expirado
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Genera un token JWT para un usuario específico.
     * 
     * @param userDetails Objeto que contiene la información del usuario autenticado.
     * @return El token JWT generado en formato de cadena.
     */
    // Metodo para generar el token con los claims y el subject
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }

    /**
     * Crea el token estableciendo los claims, el subject, la fecha de emisión, 
     * expiración y lo firma usando el algoritmo HS256.
     * 
     * @param claims Mapa de claims adicionales.
     * @param subject El identificador principal (email/username).
     * @return El token JWT firmado.
     */
    // Metodo para crear el token con los claims y el subject
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Valida que el token corresponda al usuario y no haya expirado.
     * 
     * @param token El token JWT a validar.
     * @param userDetails Los detalles del usuario.
     * @return true si el token es válido, false de lo contrario.
     */
    // Metodo para validar el token
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Obtiene la llave de firma decodificando el secreto configurado en base64.
     * 
     * @return La Key utilizada para firmar el token.
     */
    // Metodo para obtener la llave de firma
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
