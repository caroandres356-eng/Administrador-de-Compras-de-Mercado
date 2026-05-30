package com.market.admin.service;

import com.market.admin.model.ShoppingList;
import com.market.admin.model.User;
import com.market.admin.repository.ShoppingListRepository;
import com.market.admin.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ShoppingListServiceTest {

    private ShoppingListRepository shoppingListRepository;
    private UserRepository userRepository;
    private ShoppingListService shoppingListService;
    private User testUser;

    @BeforeEach
    void setUp() {
        shoppingListRepository = mock(ShoppingListRepository.class);
        userRepository = mock(UserRepository.class);

        shoppingListService = new ShoppingListService();
        ReflectionTestUtils.setField(shoppingListService, "shoppingListRepository", shoppingListRepository);
        ReflectionTestUtils.setField(shoppingListService, "userRepository", userRepository);

        testUser = User.builder()
                .id(1L)
                .email("test@test.com")
                .name("Test User")
                .build();

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("test@test.com")
                .password("")
                .authorities(List.of())
                .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
    }

    @Test
    void createList_ShouldSetUserAndSave() {
        ShoppingList list = ShoppingList.builder().name("Mi Lista").emoji("🛒").build();
        when(shoppingListRepository.save(any(ShoppingList.class))).thenAnswer(i -> i.getArgument(0));

        ShoppingList result = shoppingListService.createList(list);

        assertNotNull(result);
        assertEquals("Mi Lista", result.getName());
        assertEquals(testUser, result.getUser());
        verify(shoppingListRepository).save(list);
    }

    @Test
    void getAllLists_ShouldReturnListsForCurrentUser() {
        ShoppingList list1 = ShoppingList.builder().id(1L).name("Lista 1").user(testUser).build();
        ShoppingList list2 = ShoppingList.builder().id(2L).name("Lista 2").user(testUser).build();
        when(shoppingListRepository.findByUser(testUser)).thenReturn(List.of(list1, list2));

        List<ShoppingList> result = shoppingListService.getAllLists();

        assertEquals(2, result.size());
        assertEquals("Lista 1", result.get(0).getName());
        verify(shoppingListRepository).findByUser(testUser);
    }

    @Test
    void getAllLists_ShouldReturnEmptyList_WhenNoLists() {
        when(shoppingListRepository.findByUser(testUser)).thenReturn(List.of());

        List<ShoppingList> result = shoppingListService.getAllLists();

        assertTrue(result.isEmpty());
    }

    @Test
    void getListById_ShouldReturnList_WhenOwnedByUser() {
        ShoppingList list = ShoppingList.builder().id(1L).name("Mi Lista").user(testUser).build();
        when(shoppingListRepository.findById(1L)).thenReturn(Optional.of(list));

        ShoppingList result = shoppingListService.getListById(1L);

        assertNotNull(result);
        assertEquals("Mi Lista", result.getName());
    }

    @Test
    void getListById_ShouldThrow_WhenNotFound() {
        when(shoppingListRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> shoppingListService.getListById(99L));
    }

    @Test
    void getListById_ShouldThrow_WhenNotOwnedByUser() {
        User otherUser = User.builder().id(2L).email("other@test.com").build();
        ShoppingList list = ShoppingList.builder().id(1L).name("Otra lista").user(otherUser).build();
        when(shoppingListRepository.findById(1L)).thenReturn(Optional.of(list));

        assertThrows(RuntimeException.class, () -> shoppingListService.getListById(1L));
    }

    @Test
    void updateList_ShouldUpdateAndReturn() {
        ShoppingList existing = ShoppingList.builder().id(1L).name("Viejo nombre").emoji("❌").user(testUser).build();
        ShoppingList details = ShoppingList.builder().name("Nuevo nombre").emoji("✅").build();
        when(shoppingListRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(shoppingListRepository.save(any(ShoppingList.class))).thenAnswer(i -> i.getArgument(0));

        ShoppingList result = shoppingListService.updateList(1L, details);

        assertEquals("Nuevo nombre", result.getName());
        assertEquals("✅", result.getEmoji());
    }

    @Test
    void updateList_ShouldThrow_WhenNotFound() {
        when(shoppingListRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> shoppingListService.updateList(99L, ShoppingList.builder().build()));
    }

    @Test
    void updateList_ShouldThrow_WhenNotOwnedByUser() {
        User otherUser = User.builder().id(2L).email("other@test.com").build();
        ShoppingList existing = ShoppingList.builder().id(1L).name("No es tuya").user(otherUser).build();
        when(shoppingListRepository.findById(1L)).thenReturn(Optional.of(existing));

        assertThrows(RuntimeException.class,
                () -> shoppingListService.updateList(1L, ShoppingList.builder().build()));
    }

    @Test
    void deleteList_ShouldDelete_WhenOwnedByUser() {
        ShoppingList list = ShoppingList.builder().id(1L).name("Mi Lista").user(testUser).build();
        when(shoppingListRepository.findById(1L)).thenReturn(Optional.of(list));

        shoppingListService.deleteList(1L);

        verify(shoppingListRepository).delete(list);
    }

    @Test
    void deleteList_ShouldThrow_WhenNotFound() {
        when(shoppingListRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> shoppingListService.deleteList(99L));
    }

    @Test
    void deleteList_ShouldThrow_WhenNotOwnedByUser() {
        User otherUser = User.builder().id(2L).email("other@test.com").build();
        ShoppingList list = ShoppingList.builder().id(1L).name("No es tuya").user(otherUser).build();
        when(shoppingListRepository.findById(1L)).thenReturn(Optional.of(list));

        assertThrows(RuntimeException.class, () -> shoppingListService.deleteList(1L));
    }
}
