/**
 * Paquete para los modelos de dominio de la aplicación.
 */
package com.market.admin.model;

// Importaciones de Jakarta Persistence API
import jakarta.persistence.*;
// Importaciones de Lombok
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
// Importaciones de utilidades Java
import java.time.LocalDate;

/**
 * Entidad que representa un recordatorio de compras creado por un usuario.
 * Mapea a la tabla "reminders" en la base de datos.
 */
@Entity
@Table(name = "reminders")
@Data // genera getters, setters, equals, hashCode y toString
@NoArgsConstructor // Constructor sin parametros, necesario para JPA
@AllArgsConstructor // Constructor con todos los parametros
public class Reminder {
    
    /** Identificador único autoincremental del recordatorio. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto incremental
    private Long id;

    /** Título breve del recordatorio. */
    private String title;
    
    /** Descripción detallada del recordatorio. */
    private String description;

    /** Fecha límite del recordatorio. */
    @Column(nullable = false) // no puede ser null
    private LocalDate dueDate; // fecha de vencimiento

    /** Estado del recordatorio, indicando si ya ha sido leído/visualizado por el usuario. */
    @Column(name = "is_read")
    private boolean read = false; // indica si el recordatorio ha sido leido

    /** Relación Muchos a Uno con el usuario propietario del recordatorio. */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // la FK no puede ser null
    private User user; // relacion muchos a uno con User
}
