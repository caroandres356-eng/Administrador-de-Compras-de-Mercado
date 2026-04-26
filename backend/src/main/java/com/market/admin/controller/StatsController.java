package com.market.admin.controller;

import com.market.admin.dto.StatsResponse;
import com.market.admin.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador para la obtención de estadísticas de consumo del usuario.
 */
@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired // inyeccion de dependencias del servicio de estadisticas
    private StatsService statsService;

    /**
     * Obtiene el resumen estadístico de gastos mensuales, por categorías e
     * inventario.
     * 
     * @return DTO con los datos de estadísticas para los gráficos del frontend.
     */
    @GetMapping // metodo que devuelve las estadisticas
    public StatsResponse getStats() { // devuelve las estadisticas
        return statsService.getStats(); // devuelve las estadisticas
    }
}
