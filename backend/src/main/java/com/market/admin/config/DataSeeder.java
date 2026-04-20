package com.market.admin.config;

import com.market.admin.model.*;
import com.market.admin.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
            UserRepository userRepository,
            ShoppingListRepository listRepository,
            ProductRepository productRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (userRepository.count() > 0) return;

            // === USUARIO ===
            User user = User.builder()
                    .email("demo@mercado.com")
                    .password(passwordEncoder.encode("demo1234"))
                    .name("Carlos Pérez")
                    .avatar("👤")
                    .build();
            userRepository.save(user);

            // === LISTA 1: Mercado semanal ===
            ShoppingList lista1 = ShoppingList.builder()
                    .name("Mercado Semanal")
                    .emoji("🛒")
                    .user(user)
                    .build();
            listRepository.save(lista1);

            List<Product> productos1 = List.of(
                Product.builder().name("Leche entera").quantity(2.0).unit("litros").price(4500.0).purchased(false).category(Category.comida).shoppingList(lista1).build(),
                Product.builder().name("Huevos").quantity(12.0).unit("unidades").price(9800.0).purchased(true).category(Category.comida).shoppingList(lista1).build(),
                Product.builder().name("Pan tajado").quantity(1.0).unit("paquete").price(5200.0).purchased(true).category(Category.comida).shoppingList(lista1).build(),
                Product.builder().name("Arroz Diana").quantity(2.0).unit("kg").price(7600.0).purchased(false).category(Category.comida).shoppingList(lista1).build(),
                Product.builder().name("Aceite vegetal").quantity(1.0).unit("litro").price(12000.0).purchased(false).category(Category.comida).shoppingList(lista1).build(),
                Product.builder().name("Pollo entero").quantity(1.0).unit("kg").price(18000.0).purchased(false).category(Category.comida).shoppingList(lista1).build(),
                Product.builder().name("Tomate chonto").quantity(500.0).unit("gr").price(3200.0).purchased(true).category(Category.comida).shoppingList(lista1).build(),
                Product.builder().name("Cebolla cabezona").quantity(3.0).unit("unidades").price(2100.0).purchased(false).category(Category.comida).shoppingList(lista1).build()
            );
            productRepository.saveAll(productos1);

            // === LISTA 2: Aseo del hogar ===
            ShoppingList lista2 = ShoppingList.builder()
                    .name("Aseo del Hogar")
                    .emoji("🧹")
                    .user(user)
                    .build();
            listRepository.save(lista2);

            List<Product> productos2 = List.of(
                Product.builder().name("Jabón de ropa Ariel").quantity(1.0).unit("kg").price(22000.0).purchased(false).category(Category.aseo).shoppingList(lista2).build(),
                Product.builder().name("Suavizante Downy").quantity(1.0).unit("litro").price(15000.0).purchased(false).category(Category.aseo).shoppingList(lista2).build(),
                Product.builder().name("Papel higiénico").quantity(12.0).unit("rollos").price(18500.0).purchased(true).category(Category.aseo).shoppingList(lista2).build(),
                Product.builder().name("Jabón de manos").quantity(2.0).unit("unidades").price(8000.0).purchased(false).category(Category.aseo).shoppingList(lista2).build(),
                Product.builder().name("Desengrasante").quantity(1.0).unit("litro").price(9500.0).purchased(false).category(Category.aseo).shoppingList(lista2).build()
            );
            productRepository.saveAll(productos2);

            // === LISTA 3: Frutas y Verduras ===
            ShoppingList lista3 = ShoppingList.builder()
                    .name("Frutas y Verduras")
                    .emoji("🥦")
                    .user(user)
                    .build();
            listRepository.save(lista3);

            List<Product> productos3 = List.of(
                Product.builder().name("Bananos").quantity(6.0).unit("unidades").price(3000.0).purchased(false).category(Category.comida).shoppingList(lista3).build(),
                Product.builder().name("Manzanas").quantity(4.0).unit("unidades").price(6400.0).purchased(false).category(Category.comida).shoppingList(lista3).build(),
                Product.builder().name("Papaya").quantity(1.0).unit("unidad").price(8000.0).purchased(true).category(Category.comida).shoppingList(lista3).build(),
                Product.builder().name("Brócoli").quantity(1.0).unit("unidad").price(4500.0).purchased(false).category(Category.comida).shoppingList(lista3).build(),
                Product.builder().name("Zanahoria").quantity(500.0).unit("gr").price(2800.0).purchased(false).category(Category.comida).shoppingList(lista3).build(),
                Product.builder().name("Lechuga").quantity(1.0).unit("unidad").price(3200.0).purchased(true).category(Category.comida).shoppingList(lista3).build()
            );
            productRepository.saveAll(productos3);

            // === LISTA 4: Hogar ===
            ShoppingList lista4 = ShoppingList.builder()
                    .name("Cosas del Hogar")
                    .emoji("🏠")
                    .user(user)
                    .build();
            listRepository.save(lista4);

            List<Product> productos4 = List.of(
                Product.builder().name("Bombillos LED").quantity(3.0).unit("unidades").price(15000.0).purchased(false).category(Category.hogar).shoppingList(lista4).build(),
                Product.builder().name("Pilas AA").quantity(4.0).unit("unidades").price(8500.0).purchased(false).category(Category.hogar).shoppingList(lista4).build(),
                Product.builder().name("Bolsas de basura").quantity(1.0).unit("paquete").price(6200.0).purchased(true).category(Category.hogar).shoppingList(lista4).build(),
                Product.builder().name("Velas").quantity(6.0).unit("unidades").price(4800.0).purchased(false).category(Category.hogar).shoppingList(lista4).build()
            );
            productRepository.saveAll(productos4);

            System.out.println("✅ Seed completado — usuario: demo@mercado.com / demo1234");
        };
    }
}
