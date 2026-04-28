/**
 * Paquete para objetos de transferencia de datos (DTO).
 */
package com.market.admin.dto;

// Importaciones de Lombok para autogenerar código
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// Importaciones de utilidades Java
import java.util.List;
import java.util.Map;

/**
 * Data Transfer Object (DTO) de respuesta para el Dashboard de estadísticas.
 * Encapsula la información global procesada que se mostrará en los gráficos del frontend.
 */
@Data // genera los metodos getter y setter automaticamente
@Builder // genera el patron builder automaticamente para instanciar fácilmente
@NoArgsConstructor // genera el metodo constructor sin parametros automaticamente
@AllArgsConstructor // genera el metodo constructor con todos los parametros automaticamente
public class StatsResponse {
    
    /** Lista de datos que representan el gasto mensual. */
    @Builder.Default // anota cada campo con un valor predeterminado al usar Builder
    private List<Map<String, Object>> monthlySpend = new java.util.ArrayList<>();
    
    /** Lista de datos que representan el gasto distribuido por categorías. */
    @Builder.Default
    private List<Map<String, Object>> categorySpend = new java.util.ArrayList<>();

    /** Lista de datos que representan el gasto asociado a cada lista de compras. */
    @Builder.Default
    private List<Map<String, Object>> listSpend = new java.util.ArrayList<>();

    /** Cantidad total de listas creadas. */
    private Long totalLists;
    
    /** Cantidad total de productos en todas las listas. */
    private Long totalProducts;
    
    /** Cantidad de productos que ya han sido comprados. */
    private Long purchasedProducts;
    
    /** Cantidad de productos pendientes por comprar. */
    private Long pendingProducts;
}
