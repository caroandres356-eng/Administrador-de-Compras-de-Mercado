/**
 * Paquete para los modelos de dominio de la aplicación.
 */
package com.market.admin.model;

// Importaciones de Jakarta Persistence API para mapeo ORM
import jakarta.persistence.*;
// Importaciones de Lombok para reducir código repetitivo
import lombok.*;
// Importaciones de Jackson para la serialización/deserialización JSON
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Entidad que representa un producto individual dentro de una lista de compras.
 * Mapea a la tabla "products" en la base de datos.
 */
// Entidad que representa un producto dentro de una lista de compras
@Entity
@Table(name = "products")
@Getter          // genera los getters automaticamente
@Setter          // genera los setters automaticamente
@NoArgsConstructor  // requerido por JPA para crear instancias sin parámetros
@AllArgsConstructor // constructor con todos los parametros
@Builder            // patron builder para crear objetos facilmente
public class Product {
    
    /** Identificador único autoincremental del producto. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // id auto incremental
    private Long id;

    /** Nombre del producto (obligatorio). */
    @Column(nullable = false)
    private String name;

    /** Cantidad a comprar. Por defecto es 1.0. */
    @Builder.Default
    private Double quantity = 1.0;  // cantidad por defecto

    /** Unidad de medida (ej: kg, litros, unidad). */
    private String unit;

    /** Precio estimado del producto. Por defecto es 0.0. */
    @Builder.Default
    private Double price = 0.0;     // precio por defecto

    /** Estado del producto, indicando si ya se compró o no. */
    @Builder.Default
    private Boolean purchased = false; // no comprado por defecto

    /** Categoría a la que pertenece el producto. Guardado como texto en la BD. */
    @Enumerated(EnumType.STRING) // guarda el nombre del enum como texto en la BD
    private Category category;

    /** Relación Muchos a Uno con la lista de compras correspondiente. */
    // @JsonIgnore evita la recursion infinita al serializar a JSON
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shopping_list_id", nullable = false)
    private ShoppingList shoppingList;
}
