/**
 * Paquete para objetos de transferencia de datos (DTO).
 */
package com.market.admin.dto;

// Importaciones de Lombok para autogenerar código
import lombok.Data;

/**
 * Data Transfer Object (DTO) para capturar los datos de inicio de sesión.
 * Contiene las credenciales proporcionadas por el usuario al intentar autenticarse.
 */
@Data // Anotación de Lombok que genera automáticamente getters, setters, toString, equals y hashCode
public class LoginRequest {
    
    /** Correo electrónico del usuario (utilizado como nombre de usuario). */
    private String email;
    
    /** Contraseña proporcionada por el usuario. */
    private String password;
}
