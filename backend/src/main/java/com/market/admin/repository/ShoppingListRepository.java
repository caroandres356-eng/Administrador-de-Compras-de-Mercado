package com.market.admin.repository;

import com.market.admin.model.ShoppingList;
import com.market.admin.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShoppingListRepository extends JpaRepository<ShoppingList, Long> {
    List<ShoppingList> findByUser(User user);
}
