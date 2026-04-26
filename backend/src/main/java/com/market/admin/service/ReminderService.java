package com.market.admin.service;

import com.market.admin.model.Reminder;
import com.market.admin.model.User;
import com.market.admin.repository.ReminderRepository;
import com.market.admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service // Indica que esta clase es un servicio de spring
public class ReminderService { // Clase que se encarga de la gestión de recordatorios

    @Autowired // Inyecta el repositorio de recordatorios
    private ReminderRepository reminderRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Reminder> getRemindersByUser(String email) { // Obtiene los recordatorios del usuario
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")); // Lanza una excepcion si el usuario
                                                                                   // no es encontrado
        return reminderRepository.findByUserOrderByDueDateAsc(user); // Retorna los recordatorios ordenados por fecha de
                                                                     // vencimiento
    }

    public long getUnreadCount(String email) {// Obtiene el numero de recordatorios no leidos
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")); // Lanza una excepcion si el usuario
                                                                                   // no es encontrado
        return reminderRepository.countByUserAndReadFalse(user); // Retorna el numero de recordatorios no leidos
    }

    public Reminder createReminder(String email, Map<String, String> data) {// Crea un nuevo recordatorio
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")); // Lanza una excepcion si el usuario
                                                                                   // no es encontrado

        Reminder reminder = new Reminder(); // Crea un nuevo recordatorio
        reminder.setTitle(data.get("title")); // Obtiene el titulo del recordatorio
        reminder.setDescription(data.getOrDefault("description", "")); // Obtiene la descripcion del recordatorio
        reminder.setDueDate(LocalDate.parse(data.get("dueDate"))); // Obtiene la fecha de vencimiento del recordatorio
        reminder.setRead(false); // El recordatorio no ha sido leido
        reminder.setUser(user); // Asigna el usuario al recordatorio

        return reminderRepository.save(reminder); // Guarda el recordatorio
    }

    public void markAsRead(String email, Long reminderId) {// Marca un recordatorio como leido
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")); // Lanza una excepcion si el usuario
                                                                                   // no es encontrado

        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Recordatorio no encontrado")); // Lanza una excepcion si el
                                                                                        // recordatorio no es encontrado

        if (reminder.getUser().getId().equals(user.getId())) { // Verifica que el recordatorio pertenezca al usuario
            reminder.setRead(true); // Marca el recordatorio como leido
            reminderRepository.save(reminder); // Guarda el recordatorio
        }
    }

    public void deleteReminder(String email, Long reminderId) { // Elimina un recordatorio
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")); // Lanza una excepcion si el usuario
                                                                                   // no es encontrado

        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Recordatorio no encontrado")); // Lanza una excepcion si el
                                                                                        // recordatorio no es encontrado

        if (reminder.getUser().getId().equals(user.getId())) {
            reminderRepository.delete(reminder);
        }
    }
}
