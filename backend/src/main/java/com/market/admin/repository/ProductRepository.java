package com.market.admin.repository;

import com.market.admin.model.Product;
import com.market.admin.model.ShoppingList;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// Interfaz para la persistencia de datos de los productos
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Metodo para encontrar todos los productos de una lista de compras
    List<Product> findByShoppingList(ShoppingList shoppingList);
}
