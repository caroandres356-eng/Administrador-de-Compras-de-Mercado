package com.market.admin.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

// Entidad que representa un producto dentro de una lista de compras
@Entity
@Table(name = "products")
@Getter          // genera los getters automaticamente
@Setter          // genera los setters automaticamente
@NoArgsConstructor  // requerido por JPA
@AllArgsConstructor // constructor con todos los parametros
@Builder            // patron builder para crear objetos facilmente
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // id auto incremental
    private Long id;

    @Column(nullable = false)
    private String name;

    @Builder.Default
    private Double quantity = 1.0;  // cantidad por defecto

    private String unit;

    @Builder.Default
    private Double price = 0.0;     // precio por defecto

    @Builder.Default
    private Boolean purchased = false; // no comprado por defecto

    @Enumerated(EnumType.STRING) // guarda el nombre del enum como texto en la BD
    private Category category;

    // @JsonIgnore evita la recursion infinita al serializar a JSON
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shopping_list_id", nullable = false)
    private ShoppingList shoppingList;
}
