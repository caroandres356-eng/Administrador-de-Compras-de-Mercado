/**
 * Paquete para la capa de acceso a datos (Repositorios).
 */
package com.market.admin.repository;

// Importaciones de modelos
import com.market.admin.model.Product;
import com.market.admin.model.ShoppingList;
// Importaciones de Spring Data JPA
import org.springframework.data.jpa.repository.JpaRepository;

// Importaciones de utilidades Java
import java.util.List;

/**
 * Repositorio de Spring Data JPA para la entidad Product.
 * Proporciona métodos CRUD básicos y consultas derivadas para gestionar productos en la base de datos.
 */
// Interfaz para la persistencia de datos de los productos
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    /**
     * Busca y retorna todos los productos asociados a una lista de compras específica.
     * 
     * @param shoppingList La entidad ShoppingList de la cual se quieren obtener los productos.
     * @return Una lista de productos correspondientes a la lista solicitada.
     */
    // Metodo para encontrar todos los productos de una lista de compras
    List<Product> findByShoppingList(ShoppingList shoppingList);
}
