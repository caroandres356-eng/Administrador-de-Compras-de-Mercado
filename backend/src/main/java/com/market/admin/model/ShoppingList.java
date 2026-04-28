/**
 * Paquete para los modelos de dominio de la aplicación.
 */
package com.market.admin.model;

// Importaciones de Jakarta Persistence API
import jakarta.persistence.*;
// Importaciones de Lombok
import lombok.*;
// Importaciones de utilidades Java
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
// Importaciones de Jackson para la serialización JSON
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Entidad que representa una lista de compras que agrupa múltiples productos.
 * Pertenece a un único usuario y mapea a la tabla "shopping_lists".
 */
// Entidad que representa una lista de compras perteneciente a un usuario
@Entity
@Table(name = "shopping_lists")
@Getter  // genera todos los getters automaticamente
@Setter  // genera todos los setters automaticamente
@NoArgsConstructor  // genera el constructor sin parametros (requerido por JPA)
@AllArgsConstructor // genera el constructor con todos los parametros
@Builder            // permite crear objetos con el patron builder
public class ShoppingList {
    
    /** Identificador único autoincremental de la lista de compras. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nombre descriptivo de la lista. */
    @Column(nullable = false)
    private String name;

    /** Emoji representativo de la lista para mostrar en el UI. */
    private String emoji;

    /** Relación Muchos a Uno con el usuario propietario de la lista. */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 
     * Relación Uno a Muchos con los productos de la lista.
     * Si la lista se elimina, se borran en cascada todos sus productos asociados.
     */
    // CascadeType.ALL: si se elimina la lista, se eliminan todos sus productos (orphanRemoval)
    @OneToMany(mappedBy = "shoppingList", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default // necesario para que @Builder inicialice la lista vacia
    private List<Product> products = new ArrayList<>();

    /** Fecha de creación de la entidad en base de datos. */
    private LocalDateTime createdAt;
    
    /** Fecha de última actualización de la entidad. */
    private LocalDateTime updatedAt;

    /**
     * Método ejecutado antes de persistir la entidad por primera vez.
     * Inicializa las fechas de creación y actualización.
     */
    @PrePersist // se ejecuta automaticamente al insertar en la base de datos
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    /**
     * Método ejecutado antes de actualizar la entidad.
     * Modifica la fecha de última actualización.
     */
    @PreUpdate // se ejecuta automaticamente al actualizar en la base de datos
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
