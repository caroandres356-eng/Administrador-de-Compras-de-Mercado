/**
 * Paquete para la capa de acceso a datos (Repositorios).
 */
package com.market.admin.repository;

// Importaciones de modelos
import com.market.admin.model.ShoppingList;
import com.market.admin.model.User;
// Importaciones de Spring Data JPA
import org.springframework.data.jpa.repository.JpaRepository;

// Importaciones de utilidades Java
import java.util.List;

/**
 * Repositorio de Spring Data JPA para la entidad ShoppingList.
 * Se encarga de proveer acceso a los datos de las listas de compras en la base de datos.
 */
// Interfaz para la persistencia de datos de las listas de compras
public interface ShoppingListRepository extends JpaRepository<ShoppingList, Long> {
    
    /**
     * Obtiene todas las listas de compras asociadas a un usuario particular.
     * 
     * @param user Usuario del que se desean obtener las listas.
     * @return Lista de entidades ShoppingList pertenecientes al usuario.
     */
    // Metodo para encontrar todas las listas de compras de un usuario
    List<ShoppingList> findByUser(User user);
}
