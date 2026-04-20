package com.market.admin.controller;

import com.market.admin.model.Reminder;
import com.market.admin.model.User;
import com.market.admin.repository.ReminderRepository;
import com.market.admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = "http://localhost:3000")
public class ReminderController {

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @GetMapping
    public ResponseEntity<List<Reminder>> list(Principal principal) {
        return ResponseEntity.ok(reminderRepository.findByUserOrderByDueDateAsc(getCurrentUser(principal)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount(Principal principal) {
        long count = reminderRepository.countByUserAndReadFalse(getCurrentUser(principal));
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PostMapping
    public ResponseEntity<?> create(Principal principal, @RequestBody Map<String, String> body) {
        try {
            Reminder reminder = new Reminder();
            reminder.setTitle(body.get("title"));
            reminder.setDescription(body.getOrDefault("description", ""));
            reminder.setDueDate(LocalDate.parse(body.get("dueDate")));
            reminder.setRead(false);
            reminder.setUser(getCurrentUser(principal));
            return ResponseEntity.ok(reminderRepository.save(reminder));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markRead(Principal principal, @PathVariable Long id) {
        Reminder r = reminderRepository.findById(id).orElseThrow();
        if (r.getUser().getId().equals(getCurrentUser(principal).getId())) {
            r.setRead(true);
            reminderRepository.save(r);
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Principal principal, @PathVariable Long id) {
        Reminder r = reminderRepository.findById(id).orElseThrow();
        if (r.getUser().getId().equals(getCurrentUser(principal).getId())) {
            reminderRepository.delete(r);
        }
        return ResponseEntity.ok().build();
    }
}
