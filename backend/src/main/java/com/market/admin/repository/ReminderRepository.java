package com.market.admin.repository;

import com.market.admin.model.Reminder;
import com.market.admin.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// Interfaz para la persistencia de datos de los recordatorios
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    // Metodo para encontrar todos los recordatorios de un usuario ordenados por
    // fecha de vencimiento
    List<Reminder> findByUserOrderByDueDateAsc(User user);

    // Metodo para contar la cantidad de recordatorios no leidos de un usuario
    long countByUserAndReadFalse(User user);
}
