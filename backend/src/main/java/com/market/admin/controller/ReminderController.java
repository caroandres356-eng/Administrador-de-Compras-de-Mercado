package com.market.admin.controller;

import com.market.admin.model.Reminder;
import com.market.admin.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

// 
@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = "http://localhost:3000")
public class ReminderController {

    @Autowired
    private ReminderService reminderService;

    // GET /api/reminders
    // nos permite ver todos los recordatorios del usuario autenticado
    @GetMapping
    public ResponseEntity<List<Reminder>> list(Principal principal) {
        return ResponseEntity.ok(reminderService.getRemindersByUser(principal.getName()));
    }

    // nos permite ver la cantidad de recordatorios que no se han leido
    // GET /api/reminders/unread-count
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount(Principal principal) {
        long count = reminderService.getUnreadCount(principal.getName());
        return ResponseEntity.ok(Map.of("count", count));
    }

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

    @PatchMapping("/{id}/read") // PATCH /api/reminders/{id}/read
    // actualiza un recordatorio y lo marca como leido
    public ResponseEntity<Void> markRead(Principal principal, @PathVariable Long id) {
        reminderService.markAsRead(principal.getName(), id);
        return ResponseEntity.ok().build();
    }

    // DELETE /api/reminders/{id}
    // elimina un recordatorio con un id especifico
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Principal principal, @PathVariable Long id) {
        reminderService.deleteReminder(principal.getName(), id);
        return ResponseEntity.ok().build();
    }
}

