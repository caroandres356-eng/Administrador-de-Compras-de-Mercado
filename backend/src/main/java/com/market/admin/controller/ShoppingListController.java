/**
 * Paquete de controladores de la aplicación.
 */
package com.market.admin.controller;

// Importaciones del modelo
import com.market.admin.model.ShoppingList;
// Importaciones del servicio
import com.market.admin.service.ShoppingListService;
// Importaciones de Spring Framework
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestionar las listas de compras.
 * Proporciona endpoints para crear, leer, actualizar y eliminar listas (operaciones CRUD).
 * Devuelve toda la información en formato JSON.
 */
// controlador que devuelve toda la informacion de la lista de compras en un json
@RestController
@RequestMapping("/api/lists") // endpoint basico para acceder a los endpoints de listas de compras
public class ShoppingListController {

    @Autowired // inyeccion de dependencias del servicio de listas
    private ShoppingListService shoppingListService;

    /**
     * Obtiene todas las listas de compras registradas.
     * 
     * @return Lista de objetos ShoppingList.
     */
    @GetMapping // metodo que devuelve todas las listas de compras
    public List<ShoppingList> getAllLists() {
        return shoppingListService.getAllLists();
    }

    /**
     * Obtiene una lista de compras específica mediante su ID.
     * 
     * @param id ID de la lista a consultar.
     * @return ResponseEntity con la lista solicitada.
     */
    @GetMapping("/{id}") // metodo que devuelve una lista en especifico dependiendo de su id
    public ResponseEntity<ShoppingList> getListById(@PathVariable Long id) { // toma el id de la url y lo pasa al servicio
        return ResponseEntity.ok(shoppingListService.getListById(id));
    }

    /**
     * Crea una nueva lista de compras.
     * 
     * @param list Objeto ShoppingList con la información de la nueva lista enviada en el body.
     * @return El objeto ShoppingList creado.
     */
    @PostMapping // metodo que crea una lista
    public ShoppingList createList(@RequestBody ShoppingList list) { // toma la informacion de la lista desde el body de
                                                                     // la peticion, la vuelve un objeto y se la manda
                                                                     // al servicio para que la cree dentro de la base de datos
        return shoppingListService.createList(list);
    }

    /**
     * Actualiza la información de una lista de compras existente.
     * 
     * @param id   ID de la lista a actualizar.
     * @param list Objeto ShoppingList con los nuevos datos.
     * @return ResponseEntity con la lista de compras actualizada.
     */
    @PutMapping("/{id}") // actualiza una lista dependiendo de su id
    public ResponseEntity<ShoppingList> updateList(@PathVariable Long id, @RequestBody ShoppingList list) { // toma el id de la
                                                                                                            // url y los
                                                                                                            // atributos de la
                                                                                                            // lista desde el
                                                                                                            // body, crea una
                                                                                                            // lista, se la
                                                                                                            // pasa al servicio
                                                                                                            // y el servicio
                                                                                                            // la actualiza en la
                                                                                                            // base de datos
        return ResponseEntity.ok(shoppingListService.updateList(id, list));
    }

    /**
     * Elimina una lista de compras utilizando su ID.
     * 
     * @param id ID de la lista a eliminar.
     * @return ResponseEntity con estado 200 OK en caso de éxito.
     */
    @DeleteMapping("/{id}") // elimina una lista dependiendo de su id
    public ResponseEntity<?> deleteList(@PathVariable Long id) { // toma el id de la url y lo pasa al servicio
        shoppingListService.deleteList(id); // elimina la lista
        return ResponseEntity.ok().build(); // devuelve una respuesta ok
    }
}
