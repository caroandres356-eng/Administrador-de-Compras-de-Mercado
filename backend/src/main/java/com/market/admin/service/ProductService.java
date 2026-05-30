/**
 * Paquete para la capa de servicios, donde reside la lógica de negocio.
 */
package com.market.admin.service;

// Importaciones de modelos y repositorios
import com.market.admin.model.Product;
import com.market.admin.model.ShoppingList;
import com.market.admin.repository.ProductRepository;
// Importaciones de Spring Framework
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

// Importaciones utilitarias
import java.util.List;

/**
 * Servicio para la gestión de productos dentro de las listas de compras.
 * Contiene la lógica de negocio para crear, leer, actualizar y eliminar productos.
 */
@Service // Indica que esta clase es un servicio de spring
@Transactional // Indica que todas las operaciones de esta clase se ejecutarán dentro de una transacción de base de datos
public class ProductService { // Clase que se encarga de la gestión de productos

    @Autowired // Inyecta el repositorio de productos para interactuar con la DB
    private ProductRepository productRepository;

    @Autowired // Inyecta el servicio de listas de compras para validaciones
    private ShoppingListService shoppingListService;

    /**
     * Recupera todos los productos pertenecientes a una lista específica.
     * 
     * @param listId ID de la lista.
     * @return Lista de productos asociados.
     */
    public List<Product> getProductsByList(long listId) {
        // Obtiene la lista validando que exista y pertenezca al usuario
        ShoppingList list = shoppingListService.getListById(listId);
        // Retorna los productos usando el repositorio
        return productRepository.findByShoppingList(list);
    }

    /**
     * Añade un nuevo producto a una lista de compras.
     * 
     * @param listId  ID de la lista destino.
     * @param product Entidad producto con sus datos iniciales.
     * @return El producto guardado en la base de datos.
     */
    public Product addProductToList(long listId, Product product) {
        // Obtiene la lista validando que exista
        ShoppingList list = shoppingListService.getListById(listId);
        // Asigna la relación del producto con la lista
        product.setShoppingList(list);

        // Sincronización bidireccional para asegurar que JPA lo vea en la sesión actual
        if (list.getProducts() == null) {
            list.setProducts(new java.util.ArrayList<>());
        }
        list.getProducts().add(product);

        // Valores por defecto
        if (product.getPurchased() == null) {
            product.setPurchased(false);
        }
        // Guarda el producto en DB
        return productRepository.save(product);
    }

    /**
     * Actualiza la información de un producto existente.
     * Verifica de forma estricta que el producto pertenezca efectivamente a la lista indicada.
     * 
     * @param listId         ID de la lista de compras.
     * @param productId      ID del producto a modificar.
     * @param productDetails Objeto con los nuevos datos del producto.
     * @return El producto con sus datos actualizados.
     * @throws RuntimeException si el producto no es hallado o no pertenece a la lista.
     */
    public Product updateProduct(long listId, long productId, Product productDetails) {
        // Obtiene la lista
        ShoppingList list = shoppingListService.getListById(listId);
        // Obtiene el producto a modificar
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        // Validar que el producto corresponda a la lista solicitada
        if (!product.getShoppingList().getId().equals(list.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Product does not belong to this list");
        }

        // Actualizar solo los campos que vienen con datos
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

        // Guarda los cambios
        return productRepository.save(product);
    }

    /**
     * Elimina un producto de una lista de compras.
     * 
     * @param listId    ID de la lista correspondiente.
     * @param productId ID del producto a borrar.
     * @throws RuntimeException si no existe el producto o no coincide con la lista.
     */
    public void deleteProduct(long listId, long productId) {
        // Valida la lista
        ShoppingList list = shoppingListService.getListById(listId);
        // Busca el producto
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        // Asegurar que se intenta borrar un producto de la lista correcta
        if (!product.getShoppingList().getId().equals(list.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Product does not belong to this list");
        }

        // Elimina el producto usando el repositorio
        productRepository.delete(product);
    }
}
