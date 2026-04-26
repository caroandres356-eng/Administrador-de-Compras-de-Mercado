package com.market.admin.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String name;

    private String avatar;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL) // CascadeType.ALL significa que si se elimina el usuario,
                                                             // se eliminan todas sus listas de compras
    @Builder.Default
    private List<ShoppingList> shoppingLists = new ArrayList<>();
}
