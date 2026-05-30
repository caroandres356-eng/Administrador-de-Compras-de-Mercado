package com.market.admin.service;

import com.market.admin.model.ShoppingList;
import com.market.admin.model.User;
import com.market.admin.repository.ShoppingListRepository;
import com.market.admin.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class ShoppingListServiceIntegrationTest {

    @Autowired
    private ShoppingListService shoppingListService;

    @Autowired
    private ShoppingListRepository shoppingListRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        shoppingListRepository.deleteAll();
        userRepository.deleteAll();

        testUser = userRepository.save(User.builder()
                .email("integration@test.com")
                .password("encoded-pass")
                .name("Integration Test")
                .build());

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("integration@test.com")
                .password("")
                .authorities(List.of())
                .build();

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @AfterEach
    void tearDown() {
        shoppingListRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void createList_ShouldPersistInDatabase() {
        ShoppingList list = ShoppingList.builder().name("Compra semanal").emoji("🛍️").build();

        ShoppingList result = shoppingListService.createList(list);

        assertNotNull(result.getId());
        assertEquals("Compra semanal", result.getName());
        assertEquals(testUser.getId(), result.getUser().getId());

        ShoppingList found = shoppingListRepository.findById(result.getId()).orElseThrow();
        assertEquals("Compra semanal", found.getName());
    }

    @Test
    void getListById_ShouldReturnList() {
        ShoppingList saved = shoppingListRepository.save(
                ShoppingList.builder().name("Mi lista").user(testUser).build());

        ShoppingList result = shoppingListService.getListById(saved.getId());

        assertNotNull(result);
        assertEquals("Mi lista", result.getName());
    }

    @Test
    void getListById_ShouldThrow_WhenNotOwnedByUser() {
        User otherUser = userRepository.save(User.builder()
                .email("other@test.com")
                .password("pass")
                .name("Other")
                .build());
        ShoppingList saved = shoppingListRepository.save(
                ShoppingList.builder().name("No es mia").user(otherUser).build());

        assertThrows(RuntimeException.class, () -> shoppingListService.getListById(saved.getId()));
    }

    @Test
    void getAllLists_ShouldReturnOnlyUserLists() {
        User otherUser = userRepository.save(User.builder()
                .email("other2@test.com")
                .password("pass")
                .name("Other")
                .build());
        shoppingListRepository.save(ShoppingList.builder().name("Mi lista").user(testUser).build());
        shoppingListRepository.save(ShoppingList.builder().name("Otra mia").user(testUser).build());
        shoppingListRepository.save(ShoppingList.builder().name("De otro").user(otherUser).build());

        List<ShoppingList> result = shoppingListService.getAllLists();

        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(l -> l.getUser().getId().equals(testUser.getId())));
    }

    @Test
    void updateList_ShouldUpdateInDatabase() {
        ShoppingList saved = shoppingListRepository.save(
                ShoppingList.builder().name("Viejo nombre").emoji("❌").user(testUser).build());

        ShoppingList details = ShoppingList.builder().name("Nuevo nombre").emoji("✅").build();
        ShoppingList result = shoppingListService.updateList(saved.getId(), details);

        assertEquals("Nuevo nombre", result.getName());
        assertEquals("✅", result.getEmoji());

        ShoppingList found = shoppingListRepository.findById(saved.getId()).orElseThrow();
        assertEquals("Nuevo nombre", found.getName());
    }

    @Test
    void deleteList_ShouldRemoveFromDatabase() {
        ShoppingList saved = shoppingListRepository.save(
                ShoppingList.builder().name("A eliminar").user(testUser).build());

        shoppingListService.deleteList(saved.getId());

        assertFalse(shoppingListRepository.findById(saved.getId()).isPresent());
    }

    @Test
    void getListById_ShouldThrow_WhenNotFound() {
        assertThrows(RuntimeException.class, () -> shoppingListService.getListById(999L));
    }

    @Test
    void updateList_ShouldThrow_WhenNotFound() {
        assertThrows(RuntimeException.class,
                () -> shoppingListService.updateList(999L, ShoppingList.builder().build()));
    }

    @Test
    void updateList_ShouldThrow_WhenNotOwnedByUser() {
        User otherUser = userRepository.save(User.builder()
                .email("other-update@test.com").password("pass").name("Other").build());
        ShoppingList saved = shoppingListRepository.save(
                ShoppingList.builder().name("No es mia").user(otherUser).build());

        assertThrows(RuntimeException.class,
                () -> shoppingListService.updateList(saved.getId(), ShoppingList.builder().build()));
    }

    @Test
    void deleteList_ShouldThrow_WhenNotFound() {
        assertThrows(RuntimeException.class, () -> shoppingListService.deleteList(999L));
    }

    @Test
    void deleteList_ShouldThrow_WhenNotOwnedByUser() {
        User otherUser = userRepository.save(User.builder()
                .email("other-delete@test.com").password("pass").name("Other").build());
        ShoppingList saved = shoppingListRepository.save(
                ShoppingList.builder().name("No es mia para borrar").user(otherUser).build());

        assertThrows(RuntimeException.class, () -> shoppingListService.deleteList(saved.getId()));
    }
}
