package com.market.admin.controller;

import com.market.admin.model.ShoppingList;
import com.market.admin.service.ShoppingListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para la gestión de listas de compras.
 * Requiere autenticación via JWT.
 */
@RestController
@RequestMapping("/api/lists")
public class ShoppingListController {

    @Autowired
    private ShoppingListService shoppingListService;

    @GetMapping
    public List<ShoppingList> getAllLists() {
        return shoppingListService.getAllLists();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShoppingList> getListById(@PathVariable Long id) {
        return ResponseEntity.ok(shoppingListService.getListById(id));
    }

    @PostMapping
    public ShoppingList createList(@RequestBody ShoppingList list) {
        return shoppingListService.createList(list);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShoppingList> updateList(@PathVariable Long id, @RequestBody ShoppingList list) {
        return ResponseEntity.ok(shoppingListService.updateList(id, list));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteList(@PathVariable Long id) {
        shoppingListService.deleteList(id);
        return ResponseEntity.ok().build();
    }
}
