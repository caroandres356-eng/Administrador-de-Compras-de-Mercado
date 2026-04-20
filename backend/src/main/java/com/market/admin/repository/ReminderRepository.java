package com.market.admin.repository;

import com.market.admin.model.Reminder;
import com.market.admin.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByUserOrderByDueDateAsc(User user);
    long countByUserAndReadFalse(User user);
}
