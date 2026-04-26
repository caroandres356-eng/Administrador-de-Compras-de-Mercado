package com.market.admin.repository;

import com.market.admin.model.ShoppingList;
import com.market.admin.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// Interfaz para la persistencia de datos de las listas de compras
public interface ShoppingListRepository extends JpaRepository<ShoppingList, Long> {
    // Metodo para encontrar todas las listas de compras de un usuario
    List<ShoppingList> findByUser(User user);
}
