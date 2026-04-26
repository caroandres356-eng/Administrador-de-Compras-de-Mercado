package com.market.admin.service;

import com.market.admin.model.Product;
import com.market.admin.model.ShoppingList;
import com.market.admin.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio para la gestión de productos dentro de las listas de compras.
 */
@Service // Indica que esta clase es un servicio de spring
@Transactional // Indica que esta clase es un servicio transaccional
public class ProductService { // Clase que se encarga de la gestión de productos

    @Autowired // Inyecta el repositorio de productos
    private ProductRepository productRepository;

    @Autowired
    private ShoppingListService shoppingListService;

    /**
     * Recupera todos los productos de una lista.
     * 
     * @param listId ID de la lista.
     * @return Lista de productos.
     */
    public List<Product> getProductsByList(long listId) {
        ShoppingList list = shoppingListService.getListById(listId);
        return productRepository.findByShoppingList(list);
    }

    /**
     * Añade un producto a una lista.
     * 
     * @param listId  ID de la lista destino.
     * @param product Entidad producto con sus datos.
     * @return El producto guardado.
     */
    public Product addProductToList(long listId, Product product) {
        ShoppingList list = shoppingListService.getListById(listId);
        product.setShoppingList(list);

        // Sincronización bidireccional para asegurar que JPA lo vea en la sesión actual
        if (list.getProducts() == null) {
            list.setProducts(new java.util.ArrayList<>());
        }
        list.getProducts().add(product);

        if (product.getPurchased() == null)
            product.setPurchased(false);
        return productRepository.save(product);
    }

    /**
     * Actualiza un producto existente.
     * Verifica que el producto pertenezca efectivamente a la lista indicada.
     * 
     * @param listId         ID de la lista.
     * @param productId      ID del producto.
     * @param productDetails Nuevos datos del producto.
     * @return El producto actualizado.
     */
    public Product updateProduct(long listId, long productId, Product productDetails) {
        ShoppingList list = shoppingListService.getListById(listId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getShoppingList().getId().equals(list.getId())) {
            throw new RuntimeException("Product does not belong to this list");
        }

        if (productDetails.getName() != null)
            product.setName(productDetails.getName());
        if (productDetails.getQuantity() != null)
            product.setQuantity(productDetails.getQuantity());
        if (productDetails.getUnit() != null)
            product.setUnit(productDetails.getUnit());
        if (productDetails.getPrice() != null)
            product.setPrice(productDetails.getPrice());
        if (productDetails.getCategory() != null)
            product.setCategory(productDetails.getCategory());
        if (productDetails.getPurchased() != null)
            product.setPurchased(productDetails.getPurchased());

        return productRepository.save(product);
    }

    /**
     * Elimina un producto de una lista.
     * 
     * @param listId    ID de la lista.
     * @param productId ID del producto.
     */
    public void deleteProduct(long listId, long productId) {
        ShoppingList list = shoppingListService.getListById(listId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getShoppingList().getId().equals(list.getId())) {
            throw new RuntimeException("Product does not belong to this list");
        }

        productRepository.delete(product);
    }
}
