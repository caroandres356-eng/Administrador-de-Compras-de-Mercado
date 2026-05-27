package com.market.admin.service;

import com.market.admin.model.Category;
import com.market.admin.model.Product;
import com.market.admin.model.ShoppingList;
import com.market.admin.model.User;
import com.market.admin.repository.ProductRepository;
import com.market.admin.repository.ShoppingListRepository;
import com.market.admin.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
class ProductServiceIntegrationTest {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ShoppingListRepository shoppingListRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;
    private ShoppingList testList;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        shoppingListRepository.deleteAll();
        userRepository.deleteAll();

        testUser = userRepository.save(User.builder()
                .email("prod-integration@test.com")
                .password("encoded-pass")
                .name("Test User")
                .build());

        testList = shoppingListRepository.save(ShoppingList.builder()
                .name("Lista test")
                .user(testUser)
                .build());

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("prod-integration@test.com")
                .password("")
                .authorities(List.of())
                .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @AfterEach
    void tearDown() {
        productRepository.deleteAll();
        shoppingListRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void addProductToList_ShouldPersistInDatabase() {
        Product product = Product.builder()
                .name("Arroz")
                .quantity(2.0)
                .unit("kg")
                .price(3.5)
                .category(Category.comida)
                .build();

        Product result = productService.addProductToList(testList.getId(), product);

        assertNotNull(result.getId());
        assertEquals("Arroz", result.getName());
        assertEquals(testList.getId(), result.getShoppingList().getId());

        Product found = productRepository.findById(result.getId()).orElseThrow();
        assertEquals("Arroz", found.getName());
        assertEquals(2.0, found.getQuantity());
    }

    @Test
    void getProductsByList_ShouldReturnProducts() {
        productRepository.save(Product.builder().name("Leche").shoppingList(testList).build());
        productRepository.save(Product.builder().name("Pan").shoppingList(testList).build());

        List<Product> result = productService.getProductsByList(testList.getId());

        assertEquals(2, result.size());
    }

    @Test
    void updateProduct_ShouldUpdateInDatabase() {
        Product saved = productRepository.save(Product.builder()
                .name("Leche")
                .quantity(1.0)
                .price(2.0)
                .purchased(false)
                .shoppingList(testList)
                .build());

        Product details = Product.builder()
                .name("Leche Entera")
                .quantity(2.0)
                .price(4.0)
                .purchased(true)
                .build();

        Product result = productService.updateProduct(testList.getId(), saved.getId(), details);

        assertEquals("Leche Entera", result.getName());
        assertEquals(2.0, result.getQuantity());
        assertTrue(result.getPurchased());

        Product found = productRepository.findById(saved.getId()).orElseThrow();
        assertEquals("Leche Entera", found.getName());
    }

    @Test
    void deleteProduct_ShouldRemoveFromDatabase() {
        Product saved = productRepository.save(Product.builder()
                .name("A eliminar")
                .shoppingList(testList)
                .build());

        productService.deleteProduct(testList.getId(), saved.getId());

        assertFalse(productRepository.findById(saved.getId()).isPresent());
    }

    @Test
    void addProductToList_ShouldThrow_WhenListNotFound() {
        assertThrows(RuntimeException.class,
                () -> productService.addProductToList(999L, Product.builder().build()));
    }

    @Test
    void updateProduct_ShouldThrow_WhenProductNotFound() {
        assertThrows(RuntimeException.class,
                () -> productService.updateProduct(testList.getId(), 999L, Product.builder().build()));
    }

    @Test
    void deleteProduct_ShouldThrow_WhenProductNotFound() {
        assertThrows(RuntimeException.class,
                () -> productService.deleteProduct(testList.getId(), 999L));
    }
}
