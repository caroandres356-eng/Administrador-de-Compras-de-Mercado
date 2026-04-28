/**
 * Paquete para la capa de acceso a datos (Repositorios).
 */
package com.market.admin.repository;

// Importaciones de modelos
import com.market.admin.model.Reminder;
import com.market.admin.model.User;
// Importaciones de Spring Data JPA
import org.springframework.data.jpa.repository.JpaRepository;

// Importaciones de utilidades Java
import java.util.List;

/**
 * Repositorio de Spring Data JPA para la entidad Reminder.
 * Maneja la persistencia y consultas a la base de datos relacionadas con los recordatorios.
 */
// Interfaz para la persistencia de datos de los recordatorios
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    
    /**
     * Recupera todos los recordatorios de un usuario específico,
     * ordenados ascendentemente por la fecha de vencimiento (los más próximos primero).
     * 
     * @param user Usuario propietario de los recordatorios.
     * @return Lista de recordatorios ordenados.
     */
    // Metodo para encontrar todos los recordatorios de un usuario ordenados por fecha de vencimiento
    List<Reminder> findByUserOrderByDueDateAsc(User user);

    /**
     * Cuenta el número total de recordatorios que pertenecen a un usuario 
     * y que aún no han sido marcados como leídos.
     * 
     * @param user Usuario a consultar.
     * @return Cantidad de recordatorios no leídos.
     */
    // Metodo para contar la cantidad de recordatorios no leidos de un usuario
    long countByUserAndReadFalse(User user);
}
