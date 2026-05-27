package com.market.admin.service;

import com.market.admin.model.Category;
import com.market.admin.model.Product;
import com.market.admin.model.ShoppingList;
import com.market.admin.model.User;
import com.market.admin.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    private ProductRepository productRepository;
    private ShoppingListService shoppingListService;
    private ProductService productService;
    private ShoppingList testList;

    @BeforeEach
    void setUp() {
        productRepository = mock(ProductRepository.class);
        shoppingListService = mock(ShoppingListService.class);

        productService = new ProductService();
        ReflectionTestUtils.setField(productService, "productRepository", productRepository);
        ReflectionTestUtils.setField(productService, "shoppingListService", shoppingListService);

        User testUser = User.builder().id(1L).email("test@test.com").name("Test User").build();
        testList = ShoppingList.builder().id(1L).name("Mi Lista").user(testUser).build();
    }

    @Test
    void addProductToList_ShouldAddProduct() {
        Product product = Product.builder().name("Leche").quantity(2.0).category(Category.comida).build();
        when(shoppingListService.getListById(1L)).thenReturn(testList);
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        Product result = productService.addProductToList(1L, product);

        assertNotNull(result);
        assertEquals("Leche", result.getName());
        assertEquals(testList, result.getShoppingList());
        assertFalse(result.getPurchased());
        verify(productRepository).save(product);
    }

    @Test
    void addProductToList_ShouldSetDefaultPurchased_WhenNull() {
        Product product = Product.builder().name("Pan").purchased(null).build();
        when(shoppingListService.getListById(1L)).thenReturn(testList);
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        Product result = productService.addProductToList(1L, product);

        assertFalse(result.getPurchased());
    }

    @Test
    void addProductToList_ShouldThrow_WhenListNotFound() {
        when(shoppingListService.getListById(99L)).thenThrow(new RuntimeException("List not found"));

        assertThrows(RuntimeException.class,
                () -> productService.addProductToList(99L, Product.builder().build()));
    }

    @Test
    void getProductsByList_ShouldReturnProducts() {
        Product p1 = Product.builder().id(1L).name("Leche").shoppingList(testList).build();
        Product p2 = Product.builder().id(2L).name("Pan").shoppingList(testList).build();
        when(shoppingListService.getListById(1L)).thenReturn(testList);
        when(productRepository.findByShoppingList(testList)).thenReturn(List.of(p1, p2));

        List<Product> result = productService.getProductsByList(1L);

        assertEquals(2, result.size());
        assertEquals("Leche", result.get(0).getName());
    }

    @Test
    void getProductsByList_ShouldThrow_WhenListNotFound() {
        when(shoppingListService.getListById(99L)).thenThrow(new RuntimeException("List not found"));

        assertThrows(RuntimeException.class, () -> productService.getProductsByList(99L));
    }

    @Test
    void updateProduct_ShouldUpdateOnlyName_WhenOtherFieldsNull() throws Exception {
        Product existing = Product.builder()
                .id(1L).name("Leche").quantity(2.0).unit("l")
                .price(3.5).category(Category.comida).purchased(false)
                .shoppingList(testList).build();
        Product details = new Product();
        details.setName("Leche Entera");
        details.setQuantity(null);
        details.setPrice(null);
        details.setPurchased(null);

        when(shoppingListService.getListById(1L)).thenReturn(testList);
        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        Product result = productService.updateProduct(1L, 1L, details);

        assertEquals("Leche Entera", result.getName());
        assertEquals(2.0, result.getQuantity());
        assertEquals("l", result.getUnit());
        assertEquals(3.5, result.getPrice());
        assertEquals(Category.comida, result.getCategory());
        assertFalse(result.getPurchased());
    }

    @Test
    void updateProduct_ShouldUpdateOnlyQuantity_WhenOtherFieldsNull() throws Exception {
        Product existing = Product.builder()
                .id(1L).name("Leche").quantity(1.0).unit("l")
                .price(2.5).category(Category.comida).purchased(false)
                .shoppingList(testList).build();
        Product details = new Product();
        details.setQuantity(5.0);
        details.setPrice(null);

        when(shoppingListService.getListById(1L)).thenReturn(testList);
        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        Product result = productService.updateProduct(1L, 1L, details);

        assertEquals("Leche", result.getName());
        assertEquals(5.0, result.getQuantity());
        assertEquals(2.5, result.getPrice());
        assertFalse(result.getPurchased());
    }

    @Test
    void updateProduct_ShouldUpdateOnlyPurchased_WhenOtherFieldsNull() throws Exception {
        Product existing = Product.builder()
                .id(1L).name("Leche").quantity(1.0).unit("l")
                .price(2.5).category(Category.comida).purchased(false)
                .shoppingList(testList).build();
        Product details = new Product();
        details.setQuantity(null);
        details.setPrice(null);
        details.setPurchased(true);

        when(shoppingListService.getListById(1L)).thenReturn(testList);
        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        Product result = productService.updateProduct(1L, 1L, details);

        assertEquals("Leche", result.getName());
        assertEquals(1.0, result.getQuantity());
        assertEquals(2.5, result.getPrice());
        assertTrue(result.getPurchased());
    }

    @Test
    void updateProduct_ShouldThrow_WhenProductNotFound() {
        when(shoppingListService.getListById(1L)).thenReturn(testList);
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> productService.updateProduct(1L, 99L, Product.builder().build()));
    }

    @Test
    void updateProduct_ShouldThrow_WhenProductNotInList() {
        ShoppingList otherList = ShoppingList.builder().id(2L).name("Otra lista").user(testList.getUser()).build();
        Product existing = Product.builder().id(1L).name("Leche").shoppingList(otherList).build();

        when(shoppingListService.getListById(1L)).thenReturn(testList);
        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));

        assertThrows(RuntimeException.class,
                () -> productService.updateProduct(1L, 1L, Product.builder().build()));
    }

    @Test
    void deleteProduct_ShouldDelete_WhenValid() {
        Product product = Product.builder().id(1L).name("Leche").shoppingList(testList).build();
        when(shoppingListService.getListById(1L)).thenReturn(testList);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        productService.deleteProduct(1L, 1L);

        verify(productRepository).delete(product);
    }

    @Test
    void deleteProduct_ShouldThrow_WhenProductNotFound() {
        when(shoppingListService.getListById(1L)).thenReturn(testList);
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> productService.deleteProduct(1L, 99L));
    }

    @Test
    void deleteProduct_ShouldThrow_WhenProductNotInList() {
        ShoppingList otherList = ShoppingList.builder().id(2L).name("Otra lista").user(testList.getUser()).build();
        Product product = Product.builder().id(1L).name("Leche").shoppingList(otherList).build();

        when(shoppingListService.getListById(1L)).thenReturn(testList);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThrows(RuntimeException.class, () -> productService.deleteProduct(1L, 1L));
    }

}
