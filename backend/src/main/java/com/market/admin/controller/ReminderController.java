/**
 * Paquete de controladores de la aplicación.
 */
package com.market.admin.controller;

// Importaciones de Modelos
import com.market.admin.model.Reminder;
// Importaciones de Servicios
import com.market.admin.service.ReminderService;
// Importaciones de Spring Framework
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Importaciones de utilidades Java y Seguridad
import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para gestionar los recordatorios (Reminders) de los usuarios.
 * Proporciona endpoints para crear, leer, listar y eliminar recordatorios.
 */
@RestController
@RequestMapping("/api/reminders") // Endpoint base de recordatorios
@CrossOrigin(origins = "http://localhost:3000") // Permite CORS desde el frontend React
public class ReminderController {

    @Autowired // Inyecta el servicio de recordatorios
    private ReminderService reminderService;

    /**
     * Obtiene la lista completa de recordatorios para el usuario autenticado.
     * 
     * @param principal Objeto inyectado por Spring Security con la información del usuario actual.
     * @return ResponseEntity con la lista de recordatorios y un estado 200 OK.
     */
    // GET /api/reminders
    // nos permite ver todos los recordatorios del usuario autenticado
    @GetMapping
    public ResponseEntity<List<Reminder>> list(Principal principal) {
        return ResponseEntity.ok(reminderService.getRemindersByUser(principal.getName()));
    }

    /**
     * Obtiene el número total de recordatorios no leídos del usuario.
     * 
     * @param principal Objeto con la información del usuario autenticado.
     * @return ResponseEntity con un mapa conteniendo el conteo bajo la clave "count".
     */
    // nos permite ver la cantidad de recordatorios que no se han leido
    // GET /api/reminders/unread-count
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount(Principal principal) {
        long count = reminderService.getUnreadCount(principal.getName());
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * Crea un nuevo recordatorio asociado al usuario autenticado.
     * 
     * @param principal Objeto con la información del usuario autenticado.
     * @param body Mapa que contiene los datos del recordatorio a crear.
     * @return ResponseEntity con el recordatorio creado, o un error 400 Bad Request si falla.
     */
    // POST /api/reminders
    // crea un nuevo recordatorio y lo guarda en la base de datos
    @PostMapping
    public ResponseEntity<?> create(Principal principal, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(reminderService.createReminder(principal.getName(), body));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Marca un recordatorio específico como leído.
     * 
     * @param principal Objeto con la información del usuario autenticado.
     * @param id ID del recordatorio.
     * @return ResponseEntity con estado 200 OK si es exitoso.
     */
    @PatchMapping("/{id}/read") // PATCH /api/reminders/{id}/read
    // actualiza un recordatorio y lo marca como leido
    public ResponseEntity<Void> markRead(Principal principal, @PathVariable Long id) {
        reminderService.markAsRead(principal.getName(), id);
        return ResponseEntity.ok().build();
    }

    /**
     * Elimina un recordatorio específico del usuario autenticado.
     * 
     * @param principal Objeto con la información del usuario autenticado.
     * @param id ID del recordatorio a eliminar.
     * @return ResponseEntity con estado 200 OK si es exitoso.
     */
    // DELETE /api/reminders/{id}
    // elimina un recordatorio con un id especifico
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Principal principal, @PathVariable Long id) {
        reminderService.deleteReminder(principal.getName(), id);
        return ResponseEntity.ok().build();
    }
}
