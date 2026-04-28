/**
 * Paquete para los modelos de dominio de la aplicación.
 */
package com.market.admin.model;

// Importaciones de Jakarta Persistence API
import jakarta.persistence.*;
// Importaciones de Lombok
import lombok.*;
// Importaciones de utilidades Java
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad que representa un usuario registrado en el sistema.
 * Mapea a la tabla "users" en la base de datos.
 */
@Entity
@Table(name = "users")
@Getter // genera los getters
@Setter // genera los setters
@NoArgsConstructor // constructor por defecto requerido por JPA
@AllArgsConstructor // constructor con todos los campos
@Builder // patrón builder
public class User {

    /** Identificador único autoincremental del usuario. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Correo electrónico único para inicio de sesión. */
    @Column(unique = true, nullable = false)
    private String email;

    /** Contraseña cifrada del usuario. */
    @Column(nullable = false)
    private String password;

    /** Nombre completo o alias del usuario. */
    private String name;

    /** URL o identificador del avatar/foto de perfil del usuario. */
    private String avatar;

    /** 
     * Relación Uno a Muchos con las listas de compras del usuario.
     * El borrado en cascada (CascadeType.ALL) garantiza que si el usuario es eliminado, 
     * todas sus listas también lo serán.
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL) // CascadeType.ALL significa que si se elimina el usuario,
                                                             // se eliminan todas sus listas de compras
    @Builder.Default
    private List<ShoppingList> shoppingLists = new ArrayList<>();
}
