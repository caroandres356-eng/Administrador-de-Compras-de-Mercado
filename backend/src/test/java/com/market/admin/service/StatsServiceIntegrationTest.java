package com.market.admin.service;

import com.market.admin.dto.StatsResponse;
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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class StatsServiceIntegrationTest {

    @Autowired
    private StatsService statsService;

    @Autowired
    private ShoppingListService shoppingListService;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShoppingListRepository shoppingListRepository;

    @Autowired
    private ProductRepository productRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        shoppingListRepository.deleteAll();
        userRepository.deleteAll();

        testUser = userRepository.save(User.builder()
                .email("stats@test.com")
                .password("pass")
                .name("Stats Tester")
                .build());

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("stats@test.com")
                .password("")
                .authorities(List.of())
                .build();

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
        productRepository.deleteAll();
        shoppingListRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void getStats_ShouldReturnZeros_WhenNoLists() {
        StatsResponse stats = statsService.getStats();

        assertEquals(0, stats.getTotalLists());
        assertEquals(0, stats.getTotalProducts());
        assertEquals(0, stats.getPurchasedProducts());
        assertEquals(0, stats.getPendingProducts());
        assertTrue(stats.getMonthlySpend().isEmpty());
        assertTrue(stats.getCategorySpend().isEmpty());
        assertTrue(stats.getListSpend().isEmpty());
    }

    @Test
    void getStats_ShouldCalculateCounts() {
        ShoppingList list = shoppingListService.createList(
                ShoppingList.builder().name("Mercado Mensual").emoji("🛒").build());

        Product arroz = Product.builder()
                .name("Arroz").quantity(2.0).price(5.0).category(Category.comida).purchased(true).build();
        productService.addProductToList(list.getId(), arroz);

        Product jabon = Product.builder()
                .name("Jabon").quantity(1.0).price(3.0).category(Category.aseo).purchased(false).build();
        productService.addProductToList(list.getId(), jabon);

        Product pasaje = Product.builder()
                .name("Pasaje").quantity(1.0).price(2.5).category(Category.transporte).purchased(true).build();
        productService.addProductToList(list.getId(), pasaje);

        StatsResponse stats = statsService.getStats();

        assertEquals(1, stats.getTotalLists());
        assertEquals(3, stats.getTotalProducts());
        assertEquals(2, stats.getPurchasedProducts());
        assertEquals(1, stats.getPendingProducts());
    }

    @Test
    void getStats_ShouldCalculateCategorySpend() {
        ShoppingList list = shoppingListService.createList(
                ShoppingList.builder().name("Compras").emoji("🛍️").build());

        productService.addProductToList(list.getId(),
                Product.builder().name("Arroz").price(10.0).category(Category.comida).purchased(true).build());
        productService.addProductToList(list.getId(),
                Product.builder().name("Detergente").price(5.0).category(Category.aseo).purchased(true).build());
        productService.addProductToList(list.getId(),
                Product.builder().name("Frijoles").price(7.0).category(Category.comida).purchased(true).build());

        StatsResponse stats = statsService.getStats();

        List<Map<String, Object>> categorySpend = stats.getCategorySpend();
        assertEquals(2, categorySpend.size());

        Map<String, Object> comida = categorySpend.stream()
                .filter(c -> c.get("category").equals("Comida")).findFirst().orElseThrow();
        assertEquals(17.0, (Double) comida.get("amount"), 0.001);

        Map<String, Object> aseo = categorySpend.stream()
                .filter(c -> c.get("category").equals("Aseo")).findFirst().orElseThrow();
        assertEquals(5.0, (Double) aseo.get("amount"), 0.001);
    }

    @Test
    void getStats_ShouldCalculateListSpend() {
        ShoppingList list1 = shoppingListService.createList(
                ShoppingList.builder().name("Semana 1").emoji("1️⃣").build());
        productService.addProductToList(list1.getId(),
                Product.builder().name("Pan").price(2.0).category(Category.comida).purchased(true).build());

        ShoppingList list2 = shoppingListService.createList(
                ShoppingList.builder().name("Semana 2").emoji("2️⃣").build());
        productService.addProductToList(list2.getId(),
                Product.builder().name("Leche").price(4.0).category(Category.comida).purchased(false).build());
        productService.addProductToList(list2.getId(),
                Product.builder().name("Huevos").price(3.0).category(Category.comida).purchased(false).build());

        StatsResponse stats = statsService.getStats();

        assertEquals(2, stats.getListSpend().size());

        Map<String, Object> list1Data = stats.getListSpend().stream()
                .filter(l -> ((String) l.get("list")).contains("Semana 1")).findFirst().orElseThrow();
        assertEquals(2.0, (Double) list1Data.get("amount"), 0.001);

        Map<String, Object> list2Data = stats.getListSpend().stream()
                .filter(l -> ((String) l.get("list")).contains("Semana 2")).findFirst().orElseThrow();
        assertEquals(7.0, (Double) list2Data.get("amount"), 0.001);
    }

    @Test
    void getStats_ShouldOnlyIncludeOwnedLists() {
        User otherUser = userRepository.save(User.builder()
                .email("other@test.com").password("pass").name("Other").build());

        shoppingListRepository.save(ShoppingList.builder()
                .name("Lista de otro").user(otherUser).build());

        shoppingListService.createList(
                ShoppingList.builder().name("Mi lista").emoji("✅").build());

        StatsResponse stats = statsService.getStats();

        assertEquals(1, stats.getTotalLists());
        assertEquals(1, stats.getListSpend().size());
    }

    @Test
    void getStats_ShouldHandleProductsWithNullPrice() {
        ShoppingList list = shoppingListService.createList(
                ShoppingList.builder().name("Productos sin precio").emoji("💰").build());

        productService.addProductToList(list.getId(),
                Product.builder().name("Gratis").price(null).category(Category.otros).purchased(true).build());
        productService.addProductToList(list.getId(),
                Product.builder().name("Pagado").price(15.0).category(Category.comida).purchased(true).build());

        StatsResponse stats = statsService.getStats();

        assertEquals(2, stats.getTotalProducts());
        assertEquals(15.0, stats.getListSpend().get(0).get("amount"));

        Map<String, Object> comida = stats.getCategorySpend().stream()
                .filter(c -> c.get("category").equals("Comida")).findFirst().orElseThrow();
        assertEquals(15.0, (Double) comida.get("amount"), 0.001);
    }
}
