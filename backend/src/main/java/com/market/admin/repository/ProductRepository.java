package com.market.admin.repository;

import com.market.admin.model.Product;
import com.market.admin.model.ShoppingList;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByShoppingList(ShoppingList shoppingList);
}
