package com.market.admin.config;

import com.market.admin.model.*;
import com.market.admin.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@Profile("dev")
public class DataSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepo;
    @Autowired private ShoppingListRepository listRepo;
    @Autowired private ProductRepository productRepo;
    @Autowired private ReminderRepository reminderRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepo.count() > 0) return;

        User maria = userRepo.save(User.builder()
                .email("demo@mercalist.com")
                .password(passwordEncoder.encode("demo1234"))
                .name("María García")
                .build());

        User carlos = userRepo.save(User.builder()
                .email("admin@mercalist.com")
                .password(passwordEncoder.encode("admin1234"))
                .name("Carlos López")
                .build());

        // ── Listas de María ──────────────────────────────────────────────────
        ShoppingList mercadoMayo = listRepo.save(ShoppingList.builder()
                .name("Mercado de Mayo").emoji("🛒").user(maria).build());

        productRepo.saveAll(List.of(
                product("Arroz", 2.0, "kg",    3500.0,  true,  Category.comida,     mercadoMayo),
                product("Pollo", 1.5, "kg",   15000.0,  true,  Category.comida,     mercadoMayo),
                product("Leche", 2.0, "lt",    4800.0,  false, Category.comida,     mercadoMayo),
                product("Pan integral", 1.0, "und", 3200.0, false, Category.comida, mercadoMayo),
                product("Aceite", 1.0, "lt",   8500.0,  false, Category.comida,     mercadoMayo),
                product("Jabón de baño", 3.0, "und", 6000.0, true, Category.aseo,   mercadoMayo),
                product("Detergente", 1.0, "und", 12000.0, false, Category.aseo,    mercadoMayo)
        ));

        ShoppingList aseoMes = listRepo.save(ShoppingList.builder()
                .name("Aseo del Mes").emoji("🧴").user(maria).build());

        productRepo.saveAll(List.of(
                product("Shampoo", 1.0, "und",    9000.0, false, Category.aseo, aseoMes),
                product("Crema dental", 2.0, "und", 4500.0, true, Category.aseo, aseoMes),
                product("Papel higiénico", 1.0, "paq", 8000.0, false, Category.aseo, aseoMes),
                product("Desinfectante", 1.0, "und",  7500.0, true,  Category.aseo, aseoMes)
        ));

        ShoppingList antojoFinde = listRepo.save(ShoppingList.builder()
                .name("Antojo del Finde").emoji("🍕").user(maria).build());

        productRepo.saveAll(List.of(
                product("Pizza congelada", 2.0, "und", 18000.0, false, Category.comida, antojoFinde),
                product("Gaseosa", 2.0, "lt",   5000.0,  true,  Category.comida, antojoFinde),
                product("Papas fritas", 1.0, "und", 4000.0, false, Category.comida, antojoFinde)
        ));

        reminderRepo.saveAll(List.of(
                reminder("Hacer mercado semanal", "Revisar la nevera antes de salir",
                        LocalDate.now().plusDays(1), false, maria),
                reminder("Revisar presupuesto", "Calcular gastos del mes",
                        LocalDate.now().plusDays(7), false, maria),
                reminder("Regalo mamá", "Comprar detalle para el cumpleaños",
                        LocalDate.now().plusDays(5), false, maria)
        ));

        // ── Listas de Carlos ─────────────────────────────────────────────────
        ShoppingList mercadoSaludable = listRepo.save(ShoppingList.builder()
                .name("Mercado Saludable").emoji("🥦").user(carlos).build());

        productRepo.saveAll(List.of(
                product("Avena", 500.0, "g",    6000.0,  true,  Category.comida, mercadoSaludable),
                product("Frutas mixtas", 2.0, "kg", 15000.0, false, Category.comida, mercadoSaludable),
                product("Verduras", 1.0, "kg",  8000.0,  false, Category.comida, mercadoSaludable),
                product("Atún", 4.0, "und",    12000.0,  true,  Category.comida, mercadoSaludable),
                product("Agua mineral", 6.0, "und", 9000.0, false, Category.comida, mercadoSaludable)
        ));

        ShoppingList cosasHogar = listRepo.save(ShoppingList.builder()
                .name("Cosas del Hogar").emoji("🏠").user(carlos).build());

        productRepo.saveAll(List.of(
                product("Bombillos LED", 4.0, "und", 20000.0, false, Category.hogar, cosasHogar),
                product("Escoba", 1.0, "und",   15000.0,  true,  Category.hogar, cosasHogar),
                product("Trapeador", 1.0, "und", 18000.0,  false, Category.hogar, cosasHogar)
        ));

        reminderRepo.saveAll(List.of(
                reminder("Pagar arriendo", "Transferir antes del vencimiento",
                        LocalDate.now().plusDays(3), false, carlos),
                reminder("Compra del mes", "Lista de mercado lista en la app",
                        LocalDate.now().plusDays(10), false, carlos)
        ));
    }

    private Product product(String name, Double qty, String unit, Double price,
                            Boolean purchased, Category category, ShoppingList list) {
        return Product.builder()
                .name(name).quantity(qty).unit(unit).price(price)
                .purchased(purchased).category(category).shoppingList(list)
                .build();
    }

    private Reminder reminder(String title, String desc, LocalDate due, boolean read, User user) {
        return Reminder.builder()
                .title(title).description(desc).dueDate(due).read(read).user(user)
                .build();
    }
}
