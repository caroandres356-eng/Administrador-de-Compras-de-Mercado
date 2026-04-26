package com.market.admin.controller;

import com.market.admin.model.Product;
import com.market.admin.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//esta clase recibira peticiones en json y devolvera respuestas en json
@RestController
// este es el endpoint base para todas las peticiones que manejara este
// controlador
@RequestMapping("/api/lists/{listId}/products")
public class ProductController {

    @Autowired // inyectamos dependencias de el servicio relaiconado con productos
    private ProductService productService;

    /**
     * Obtiene todos los productos asociados a una lista de compras.
     * 
     * @param listId ID de la lista.
     * @return Lista de productos.
     */
    // nos permite traer la lista de productos respecto a un id de lista
    @GetMapping // @pathvariable es para traer datos desde la url sirectamente
    public List<Product> getProducts(@PathVariable Long listId) {
        return productService.getProductsByList(listId);
    }

    /**
     * Añade un nuevo producto a una lista de compras.
     * 
     * @param listId  ID de la lista.
     * @param product Datos del producto a añadir.
     * @return El producto creado.
     */
    @PostMapping // nos permite agregar un producto en una lista especifica respecto a su id
    // tomamos la id del ur, luego creamos un objeto producto desde el body de la
    // peticion y lo agregamos al alista de productos invocando el servicio
    public Product addProduct(@PathVariable Long listId, @RequestBody Product product) {
        return productService.addProductToList(listId, product);
    }

    /**
     * Actualiza un producto existente en una lista.
     * 
     * @param listId    ID de la lista.
     * @param productId ID del producto a actualizar.
     * @param product   Nuevos datos del producto.
     * @return El producto actualizado.
     */
    // peticiones con metodo put en el endpoint
    // /api/lists/{listId}/products/{productId}
    // para actualizar un producto en especifico de ntro de un alista
    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long listId, // ide de lista desde la url
            @PathVariable Long productId, // ud de producto desde la url
            @RequestBody Product product) { // objeto de el producto desde la peticion
        return ResponseEntity.ok(productService.updateProduct(listId, productId, product));
    }

    /**
     * Elimina un producto de una lista de compras.
     * 
     * @param listId    ID de la lista.
     * @param productId ID del producto a eliminar.
     * @return ResponseEntity con estado 200 si la operación fue exitosa.
     */
    // petiiviones delete con el endpoint /api/lists/{listId}/products/{productId}
    // elimina un producto dentro de una lista en especifico con su id
    @DeleteMapping("/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long listId, @PathVariable Long productId) {
        productService.deleteProduct(listId, productId);
        return ResponseEntity.ok().build();
    }
}
