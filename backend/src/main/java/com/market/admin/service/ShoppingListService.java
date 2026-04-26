package com.market.admin.service;

import com.market.admin.model.ShoppingList;
import com.market.admin.model.User;
import com.market.admin.repository.ShoppingListRepository;
import com.market.admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio para la gestión de listas de compras vinculadas al usuario
 * autenticado.
 */
@Service
@Transactional // Indica que esta clase es un servicio transaccional
public class ShoppingListService {

    @Autowired
    private ShoppingListRepository shoppingListRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Obtiene el usuario autenticado a partir del contexto de seguridad (JWT).
     * 
     * @return Objeto User persistido.
     */
    public User getCurrentUser() {// Obtiene el usuario autenticado a partir del contexto de seguridad (JWT).
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        if (principal instanceof UserDetails) {// Verifica que el principal sea un UserDetails
            email = ((UserDetails) principal).getUsername();// Obtiene el usuario autenticado a partir del contexto de
                                                            // seguridad (JWT).
        } else {
            email = principal.toString();// Convierte el principal a string
        }
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Recupera todas las listas de compras del usuario actual.
     * 
     * @return Lista de ShoppingList.
     */
    public List<ShoppingList> getAllLists() {
        return shoppingListRepository.findByUser(getCurrentUser());
    }

    /**
     * Crea una nueva lista de compras para el usuario actual.
     * 
     * @param list Entidad con los datos de la nueva lista.
     * @return La lista guardada.
     */
    public ShoppingList createList(ShoppingList list) {
        list.setUser(getCurrentUser());
        return shoppingListRepository.save(list);
    }

    /**
     * Actualiza los datos de una lista de compras existente.
     * Verifica que el usuario tenga autorización sobre la lista.
     * 
     * @param id          ID de la lista.
     * @param listDetails Nuevos datos de la lista.
     * @return La lista actualizada.
     */
    public ShoppingList updateList(long id, ShoppingList listDetails) {
        ShoppingList list = shoppingListRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("List not found"));

        if (!list.getUser().getId().equals(getCurrentUser().getId())) {
            throw new RuntimeException("Unauthorized");
        }

        list.setName(listDetails.getName());
        list.setEmoji(listDetails.getEmoji());
        return shoppingListRepository.save(list);
    }

    /**
     * Elimina una lista de compras.
     * 
     * @param id ID de la lista.
     */
    public void deleteList(long id) {
        ShoppingList list = shoppingListRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("List not found"));

        if (!list.getUser().getId().equals(getCurrentUser().getId())) {
            throw new RuntimeException("Unauthorized");
        }

        shoppingListRepository.delete(list);
    }

    /**
     * Busca una lista específica por su ID.
     * 
     * @param id ID de la lista.
     * @return La lista encontrada.
     */
    public ShoppingList getListById(long id) {
        ShoppingList list = shoppingListRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("List not found"));

        if (!list.getUser().getId().equals(getCurrentUser().getId())) {
            throw new RuntimeException("Unauthorized");
        }

        return list;
    }
}
