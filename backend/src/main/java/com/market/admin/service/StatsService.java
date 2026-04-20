package com.market.admin.service;

import com.market.admin.dto.StatsResponse;
import com.market.admin.model.Product;
import com.market.admin.model.ShoppingList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Servicio encargado de la agregación de datos para la visualización de estadísticas.
 */
@Service
public class StatsService {

    @Autowired
    private ShoppingListService shoppingListService;

    /**
     * Calcula y agrupa estadísticas de gastos mensuales, por categoría y estado de inventario.
     * @return DTO StatsResponse formateado para el consumo del frontend.
     */
    public StatsResponse getStats() {
        List<ShoppingList> lists = shoppingListService.getAllLists();
        List<Product> allProducts = lists.stream()
                .flatMap(l -> (l.getProducts() != null ? l.getProducts().stream() : java.util.stream.Stream.empty()))
                .collect(Collectors.toList());

        // Gasto Mensual: Agrupa la suma de precios de productos por el mes de creación de la lista.
        Map<String, Double> monthlyMap = new LinkedHashMap<>();
        lists.forEach(l -> {
            String month = l.getCreatedAt().getMonth().getDisplayName(TextStyle.SHORT, new Locale("es", "CO"));
            double listTotal = (l.getProducts() != null ? l.getProducts().stream() : java.util.stream.Stream.<Product>empty())
                    .mapToDouble(p -> p.getPrice() != null ? p.getPrice() : 0.0)
                    .sum();
            monthlyMap.put(month, monthlyMap.getOrDefault(month, 0.0) + listTotal);
        });

        List<Map<String, Object>> monthlySpendData = monthlyMap.entrySet().stream()
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("month", e.getKey());
                    m.put("amount", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());

        // Gasto por Categoría: Suma precios de productos agrupados por su ENUM de categoría.
        Map<String, Double> categoryMap = new HashMap<>();
        allProducts.forEach(p -> {
            String cat = p.getCategory() != null ? p.getCategory().name() : "otros";
            double price = p.getPrice() != null ? p.getPrice() : 0.0;
            categoryMap.put(cat, categoryMap.getOrDefault(cat, 0.0) + price);
        });

        List<Map<String, Object>> categorySpendData = categoryMap.entrySet().stream()
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    // Capitaliza para consistencia visual en el frontend.
                    String label = e.getKey().substring(0, 1).toUpperCase() + e.getKey().substring(1);
                    m.put("category", label);
                    m.put("amount", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());

        // Gasto por Lista: Suma todos los precios de los productos de cada lista.
        List<Map<String, Object>> listSpendData = lists.stream()
                .map(l -> {
                    double total = (l.getProducts() != null ? l.getProducts().stream() : java.util.stream.Stream.<Product>empty())
                            .mapToDouble(p -> p.getPrice() != null ? p.getPrice() : 0.0)
                            .sum();
                    Map<String, Object> m = new HashMap<>();
                    String listName = l.getName() != null ? l.getName() : "Lista";
                    // Truncar nombres largos para que quepan en la gráfica
                    m.put("list", listName.length() > 12 ? listName.substring(0, 12) + "…" : listName);
                    m.put("amount", total);
                    return m;
                })
                .collect(Collectors.toList());

        return StatsResponse.builder()
                .monthlySpend(monthlySpendData)
                .categorySpend(categorySpendData)
                .listSpend(listSpendData)
                .totalLists((long) lists.size())
                .totalProducts((long) allProducts.size())
                .purchasedProducts(allProducts.stream().filter(p -> p.getPurchased() != null && p.getPurchased()).count())
                .pendingProducts(allProducts.stream().filter(p -> p.getPurchased() == null || !p.getPurchased()).count())
                .build();
    }
}
