/**
 * Paquete para objetos de transferencia de datos (DTO).
 */
package com.market.admin.dto;

// Importaciones de Lombok para autogenerar código
import lombok.Data;

/**
 * Data Transfer Object (DTO) para el formulario de registro de nuevos usuarios.
 * Recibe los datos enviados desde el cliente para crear una cuenta.
 */
@Data // Anotación de Lombok que genera automáticamente getters, setters, toString, equals y hashCode
public class RegisterRequest {
    
    /** Correo electrónico del nuevo usuario (será su identificador principal). */
    private String email;
    
    /** Contraseña en texto plano enviada para registro (se cifrará antes de guardarse). */
    private String password;
    
    /** Nombre completo del usuario a registrar. */
    private String name;
}
