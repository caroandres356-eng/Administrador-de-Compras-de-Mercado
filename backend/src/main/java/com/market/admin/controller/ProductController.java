package com.market.admin.controller;

import com.market.admin.model.Product;
import com.market.admin.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para la gestión de productos dentro de una lista de compras.
 * Permite realizar operaciones CRUD sobre los productos de una lista específica.
 */
@RestController
@RequestMapping("/api/lists/{listId}/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * Obtiene todos los productos asociados a una lista de compras.
     * @param listId ID de la lista.
     * @return Lista de productos.
     */
    @GetMapping
    public List<Product> getProducts(@PathVariable Long listId) {
        return productService.getProductsByList(listId);
    }

    /**
     * Añade un nuevo producto a una lista de compras.
     * @param listId ID de la lista.
     * @param product Datos del producto a añadir.
     * @return El producto creado.
     */
    @PostMapping
    public Product addProduct(@PathVariable Long listId, @RequestBody Product product) {
        return productService.addProductToList(listId, product);
    }

    /**
     * Actualiza un producto existente en una lista.
     * @param listId ID de la lista.
     * @param productId ID del producto a actualizar.
     * @param product Nuevos datos del producto.
     * @return El producto actualizado.
     */
    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long listId,
            @PathVariable Long productId,
            @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(listId, productId, product));
    }

    /**
     * Elimina un producto de una lista de compras.
     * @param listId ID de la lista.
     * @param productId ID del producto a eliminar.
     * @return ResponseEntity con estado 200 si la operación fue exitosa.
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long listId, @PathVariable Long productId) {
        productService.deleteProduct(listId, productId);
        return ResponseEntity.ok().build();
    }
}
