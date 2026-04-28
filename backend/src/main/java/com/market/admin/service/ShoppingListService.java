/**
 * Paquete para la capa de servicios, donde reside la lógica de negocio.
 */
package com.market.admin.service;

// Importaciones de modelos y repositorios
import com.market.admin.model.ShoppingList;
import com.market.admin.model.User;
import com.market.admin.repository.ShoppingListRepository;
import com.market.admin.repository.UserRepository;
// Importaciones de Spring Framework y Seguridad
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Importaciones utilitarias
import java.util.List;

/**
 * Servicio para la gestión de listas de compras vinculadas al usuario
 * autenticado.
 * Contiene la lógica para operaciones CRUD de listas asegurando el aislamiento entre usuarios.
 */
@Service // Indica que es un servicio gestionado por Spring
@Transactional // Indica que los métodos de esta clase ejecutan operaciones transaccionales en la DB
public class ShoppingListService {

    @Autowired // Repositorio de listas de compras
    private ShoppingListRepository shoppingListRepository;

    @Autowired // Repositorio de usuarios
    private UserRepository userRepository;

    /**
     * Obtiene el usuario autenticado a partir del contexto de seguridad (JWT).
     * 
     * @return Objeto User persistido.
     * @throws RuntimeException si no se puede recuperar la información de sesión.
     */
    public User getCurrentUser() {
        // Obtiene el principal del contexto de seguridad
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        
        // Verifica si el principal es una instancia de UserDetails (comportamiento normal en Spring Security)
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            // Fallback por si el principal es solo el username en string
            email = principal.toString();
        }
        
        // Busca y retorna el usuario en la BD
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Recupera todas las listas de compras del usuario actual.
     * 
     * @return Lista de ShoppingList correspondientes al usuario logueado.
     */
    public List<ShoppingList> getAllLists() {
        return shoppingListRepository.findByUser(getCurrentUser());
    }

    /**
     * Crea una nueva lista de compras para el usuario actual.
     * 
     * @param list Entidad con los datos de la nueva lista.
     * @return La lista guardada en la BD.
     */
    public ShoppingList createList(ShoppingList list) {
        // Vincula la nueva lista al usuario autenticado
        list.setUser(getCurrentUser());
        return shoppingListRepository.save(list);
    }

    /**
     * Actualiza los datos de una lista de compras existente.
     * Verifica que el usuario tenga autorización sobre la lista (que sea el dueño).
     * 
     * @param id          ID de la lista a actualizar.
     * @param listDetails Nuevos datos de la lista (nombre, emoji).
     * @return La lista actualizada.
     * @throws RuntimeException si la lista no existe o el usuario no está autorizado.
     */
    public ShoppingList updateList(long id, ShoppingList listDetails) {
        // Busca la lista
        ShoppingList list = shoppingListRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("List not found"));

        // Valida propiedad de la lista
        if (!list.getUser().getId().equals(getCurrentUser().getId())) {
            throw new RuntimeException("Unauthorized");
        }

        // Aplica cambios
        list.setName(listDetails.getName());
        list.setEmoji(listDetails.getEmoji());
        
        // Guarda cambios
        return shoppingListRepository.save(list);
    }

    /**
     * Elimina una lista de compras específica.
     * Valida que pertenezca al usuario actual antes de borrarla.
     * 
     * @param id ID de la lista.
     * @throws RuntimeException si la lista no existe o el usuario no está autorizado.
     */
    public void deleteList(long id) {
        // Busca la lista
        ShoppingList list = shoppingListRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("List not found"));

        // Valida propiedad
        if (!list.getUser().getId().equals(getCurrentUser().getId())) {
            throw new RuntimeException("Unauthorized");
        }

        // Elimina de DB
        shoppingListRepository.delete(list);
    }

    /**
     * Busca una lista específica por su ID.
     * Valida que el usuario tenga acceso a ella.
     * 
     * @param id ID de la lista a buscar.
     * @return La lista encontrada.
     * @throws RuntimeException si no existe o no tiene permisos.
     */
    public ShoppingList getListById(long id) {
        // Busca la lista
        ShoppingList list = shoppingListRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("List not found"));

        // Valida permisos
        if (!list.getUser().getId().equals(getCurrentUser().getId())) {
            throw new RuntimeException("Unauthorized");
        }

        return list;
    }
}
