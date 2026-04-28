/**
 * Paquete de controladores de la aplicación.
 */
package com.market.admin.controller;

// Importaciones de DTOs y Servicios
import com.market.admin.dto.StatsResponse;
import com.market.admin.service.StatsService;
// Importaciones de Spring Framework
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para la obtención de estadísticas de consumo.
 * Proporciona endpoints para los gráficos y analíticas del panel de control.
 */
@RestController
@RequestMapping("/api/stats") // Endpoint base para las estadísticas
public class StatsController {

    @Autowired // inyeccion de dependencias del servicio de estadisticas
    private StatsService statsService;

    /**
     * Obtiene el resumen estadístico global, incluyendo gastos mensuales, 
     * distribución por categorías y estado del inventario.
     * 
     * @return Objeto StatsResponse DTO con los datos de estadísticas listos para el frontend.
     */
    @GetMapping // metodo que maneja las peticiones GET en /api/stats
    public StatsResponse getStats() { 
        // Invoca al servicio para generar y devolver las estadísticas calculadas
        return statsService.getStats(); 
    }
}
