package com.market.admin.controller;

import com.market.admin.model.ShoppingList;
import com.market.admin.service.ShoppingListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// controlador que devuelve toda la informacion de la lista de compras  en un json
@RestController
@RequestMapping("/api/lists") // endpoint basico para acceder a los endpoints de llistas de compras
public class ShoppingListController {

    @Autowired // inyeccion de dependencias del servicio de listas
    private ShoppingListService shoppingListService;

    @GetMapping // metodo que devuelve todas las listas de compras
    public List<ShoppingList> getAllLists() {
        return shoppingListService.getAllLists();
    }

    @GetMapping("/{id}") // metodo que devuelve una lista en especifico depenedientdo de su id
    public ResponseEntity<ShoppingList> getListById(@PathVariable Long id) {// toma el id de la url y lo pasa al
                                                                            // servicio
        return ResponseEntity.ok(shoppingListService.getListById(id));
    }

    @PostMapping // metodo que crea ua lista
    public ShoppingList createList(@RequestBody ShoppingList list) {// toma la informacuon de la lista desde el body de
                                                                    // la peticion , la vuelve un objeto y se la manda
                                                                    // al servicio apra que la cree dentro de la base de
                                                                    // datos
        return shoppingListService.createList(list);
    }

    @PutMapping("/{id}") // actualiza una lista dependiendo de su id
    public ResponseEntity<ShoppingList> updateList(@PathVariable Long id, @RequestBody ShoppingList list) { // tona el
                                                                                                            // id de la
                                                                                                            // urlm los
                                                                                                            // atributos
                                                                                                            // de la
                                                                                                            // lista
                                                                                                            // desde el
                                                                                                            // body y
                                                                                                            // crea una
                                                                                                            // lista ,
                                                                                                            // se la
                                                                                                            // pasa a el
                                                                                                            // servicio
                                                                                                            // y el
                                                                                                            // servicio
                                                                                                            // la guarda
                                                                                                            // en la
                                                                                                            // base de
                                                                                                            // datos
        return ResponseEntity.ok(shoppingListService.updateList(id, list));
    }

    @DeleteMapping("/{id}") // elimina una lista dependiendo de su id
    public ResponseEntity<?> deleteList(@PathVariable Long id) {// toma el id de la url y lo pasa al servicio
        shoppingListService.deleteList(id); // elimina la lista
        return ResponseEntity.ok().build(); // devuelve una respuesta ok
    }
}
