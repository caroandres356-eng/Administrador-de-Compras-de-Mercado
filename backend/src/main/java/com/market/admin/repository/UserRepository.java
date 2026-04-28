/**
 * Paquete para la capa de acceso a datos (Repositorios).
 */
package com.market.admin.repository;

// Importaciones del modelo User
import com.market.admin.model.User;
// Importaciones de Spring Data JPA
import org.springframework.data.jpa.repository.JpaRepository;

// Importaciones de utilidades Java
import java.util.Optional;

/**
 * Repositorio de Spring Data JPA para la entidad User.
 * Maneja operaciones CRUD sobre los usuarios almacenados en la base de datos.
 */
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Busca un usuario mediante su correo electrónico.
     * Es utilizado principalmente durante el proceso de autenticación.
     * 
     * @param email Correo electrónico a buscar.
     * @return Un objeto Optional que contiene el User si es hallado, o vacío de lo contrario.
     */
    // Metodo para encontrar un usuario por su correo electronico
    Optional<User> findByEmail(String email);
}
