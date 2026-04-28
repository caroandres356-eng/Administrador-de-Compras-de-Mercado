/**
 * Paquete para la capa de servicios, donde reside la lógica de negocio.
 */
package com.market.admin.service;

// Importaciones de DTOs y modelos
import com.market.admin.dto.StatsResponse;
import com.market.admin.model.Product;
import com.market.admin.model.ShoppingList;
// Importaciones de Spring Framework
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// Importaciones utilitarias
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Servicio encargado de la agregación y procesamiento de datos para la visualización de estadísticas.
 * Transforma datos crudos del sistema en formatos listos para gráficos en el frontend.
 */
@Service // Indica que es un servicio de Spring
public class StatsService {

    @Autowired // Inyecta el servicio de listas para obtener los datos del usuario actual
    private ShoppingListService shoppingListService;

    /**
     * Calcula y agrupa estadísticas de gastos mensuales, por categoría y estado de inventario.
     * Extrae todas las listas y productos del usuario autenticado para realizar el cálculo analítico.
     * 
     * @return DTO StatsResponse formateado y estructurado para el consumo del frontend.
     */
    public StatsResponse getStats() {
        // Obtiene todas las listas del usuario actual
        List<ShoppingList> lists = shoppingListService.getAllLists();
        
        // Aplanar todos los productos de todas las listas en una sola colección
        List<Product> allProducts = lists.stream()
                .flatMap(l -> (l.getProducts() != null ? l.getProducts().stream() : java.util.stream.Stream.empty()))
                .collect(Collectors.toList());

        // Gasto Mensual: Agrupa la suma de precios de productos por el mes de creación de la lista.
        Map<String, Double> monthlyMap = new LinkedHashMap<>();
        lists.forEach(l -> {
            // Extrae el nombre del mes corto en español de Colombia
            String month = l.getCreatedAt().getMonth().getDisplayName(TextStyle.SHORT, new Locale("es", "CO"));
            
            // Suma el precio de los productos de esa lista
            double listTotal = (l.getProducts() != null ? l.getProducts().stream() : java.util.stream.Stream.<Product>empty())
                    .mapToDouble(p -> p.getPrice() != null ? p.getPrice() : 0.0)
                    .sum();
                    
            // Acumula el total en el mapa mensual
            monthlyMap.put(month, monthlyMap.getOrDefault(month, 0.0) + listTotal);
        });

        // Convierte el mapa de meses en la estructura JSON requerida (lista de mapas con claves "month" y "amount")
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

        // Convierte el mapa de categorías en la estructura JSON requerida (lista de mapas con claves "category" y "amount")
        List<Map<String, Object>> categorySpendData = categoryMap.entrySet().stream()
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    // Capitaliza la primera letra para consistencia visual en el frontend.
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
                    // Truncar nombres largos para que quepan correctamente en las etiquetas de la gráfica
                    m.put("list", listName.length() > 12 ? listName.substring(0, 12) + "…" : listName);
                    m.put("amount", total);
                    return m;
                })
                .collect(Collectors.toList());

        // Construye y retorna la respuesta agrupando todos los cálculos e indicadores generales
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
