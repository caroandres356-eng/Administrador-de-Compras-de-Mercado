/**
 * Paquete de controladores de la aplicación.
 */
package com.market.admin.controller;

// Importaciones de los modelos de la aplicación
import com.market.admin.model.Product;
// Importaciones de los servicios de la aplicación
import com.market.admin.service.ProductService;
// Importaciones de Spring Framework web
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Importaciones utilitarias de Java
import java.util.List;

/**
 * Controlador REST que maneja las operaciones sobre los productos.
 * Esta clase recibe peticiones en JSON y devuelve respuestas en JSON.
 */
// esta clase recibira peticiones en json y devolvera respuestas en json
@RestController
// este es el endpoint base para todas las peticiones que manejara este
// controlador
@RequestMapping("/api/lists/{listId}/products")
public class ProductController {

    @Autowired // inyectamos dependencias de el servicio relacionado con productos
    private ProductService productService;

    /**
     * Obtiene todos los productos asociados a una lista de compras.
     * 
     * @param listId ID de la lista. Obtenido desde la URL usando @PathVariable.
     * @return Lista de objetos Product correspondientes a la lista especificada.
     */
    // nos permite traer la lista de productos respecto a un id de lista
    @GetMapping // @pathvariable es para traer datos desde la url directamente
    public List<Product> getProducts(@PathVariable Long listId) {
        return productService.getProductsByList(listId);
    }

    /**
     * Añade un nuevo producto a una lista de compras específica.
     * 
     * @param listId  ID de la lista donde se agregará el producto.
     * @param product Objeto Producto obtenido desde el cuerpo de la petición (@RequestBody).
     * @return El objeto Product creado y persistido en la base de datos.
     */
    @PostMapping // nos permite agregar un producto en una lista especifica respecto a su id
    // tomamos el id de la url, luego creamos un objeto producto desde el body de la
    // peticion y lo agregamos a la lista de productos invocando el servicio
    public Product addProduct(@PathVariable Long listId, @RequestBody Product product) {
        return productService.addProductToList(listId, product);
    }

    /**
     * Actualiza la información de un producto existente dentro de una lista.
     * 
     * @param listId    ID de la lista.
     * @param productId ID del producto a actualizar.
     * @param product   Objeto Product con los nuevos datos recibidos en la petición.
     * @return ResponseEntity con el producto actualizado y estado 200 OK.
     */
    // peticiones con metodo put en el endpoint
    // /api/lists/{listId}/products/{productId}
    // para actualizar un producto en especifico dentro de una lista
    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long listId, // id de la lista desde la url
            @PathVariable Long productId, // id del producto desde la url
            @RequestBody Product product) { // objeto del producto desde la peticion
        return ResponseEntity.ok(productService.updateProduct(listId, productId, product));
    }

    /**
     * Elimina un producto específico de una lista de compras.
     * 
     * @param listId    ID de la lista.
     * @param productId ID del producto a eliminar.
     * @return ResponseEntity con estado 200 OK si la operación fue exitosa, sin cuerpo.
     */
    // peticiones delete con el endpoint /api/lists/{listId}/products/{productId}
    // elimina un producto dentro de una lista en especifico con su id
    @DeleteMapping("/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long listId, @PathVariable Long productId) {
        productService.deleteProduct(listId, productId);
        return ResponseEntity.ok().build();
    }
}
