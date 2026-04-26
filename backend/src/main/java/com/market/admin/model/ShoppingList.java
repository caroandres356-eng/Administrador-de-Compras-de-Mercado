package com.market.admin.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

// Entidad que representa una lista de compras perteneciente a un usuario
@Entity
@Table(name = "shopping_lists")
@Getter  // genera todos los getters automaticamente
@Setter  // genera todos los setters automaticamente
@NoArgsConstructor  // genera el constructor sin parametros (requerido por JPA)
@AllArgsConstructor // genera el constructor con todos los parametros
@Builder            // permite crear objetos con el patron builder
public class ShoppingList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String emoji;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // CascadeType.ALL: si se elimina la lista, se eliminan todos sus productos (orphanRemoval)
    @OneToMany(mappedBy = "shoppingList", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default // necesario para que @Builder inicialice la lista vacia
    private List<Product> products = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist // se ejecuta automaticamente al insertar en la base de datos
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate // se ejecuta automaticamente al actualizar en la base de datos
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
