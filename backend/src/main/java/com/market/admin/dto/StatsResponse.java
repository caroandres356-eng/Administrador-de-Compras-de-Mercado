package com.market.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * DTO de respuesta para el Dashboard de estadísticas.
 */
@Data // genera los metodos getter y setter automaticamente
@Builder // genera el metodo builder automaticamente
@NoArgsConstructor // genera el metodo constructor sin parametros automaticamente
@AllArgsConstructor // genera el metodo constructor con todos los parametros automaticamente
public class StatsResponse {
    @Builder.Default
    private List<Map<String, Object>> monthlySpend = new java.util.ArrayList<>();
    // @Builder.Default anota cada campo con un valor predeterminado
    @Builder.Default
    private List<Map<String, Object>> categorySpend = new java.util.ArrayList<>();

    @Builder.Default
    private List<Map<String, Object>> listSpend = new java.util.ArrayList<>();

    private Long totalLists;
    private Long totalProducts;
    private Long purchasedProducts;
    private Long pendingProducts;
}
