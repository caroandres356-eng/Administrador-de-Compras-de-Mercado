package com.market.admin.service;

import com.market.admin.model.Reminder;
import com.market.admin.model.User;
import com.market.admin.repository.ReminderRepository;
import com.market.admin.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class ReminderServiceIntegrationTest {

    @Autowired
    private ReminderService reminderService;

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        reminderRepository.deleteAll();
        userRepository.deleteAll();

        testUser = userRepository.save(User.builder()
                .email("reminder-integration@test.com")
                .password("encoded-pass")
                .name("Reminder Tester")
                .build());
    }

    @AfterEach
    void tearDown() {
        reminderRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void createReminder_ShouldPersistInDatabase() {
        Map<String, String> data = Map.of(
                "title", "Comprar verduras",
                "description", "Zanahorias, brócoli, espinaca",
                "dueDate", "2026-06-20"
        );

        Reminder result = reminderService.createReminder(testUser.getEmail(), data);

        assertNotNull(result.getId());
        assertEquals("Comprar verduras", result.getTitle());
        assertEquals(testUser.getId(), result.getUser().getId());

        Reminder found = reminderRepository.findById(result.getId()).orElseThrow();
        assertEquals("Comprar verduras", found.getTitle());
        assertEquals(LocalDate.of(2026, 6, 20), found.getDueDate());
        assertFalse(found.isRead());
    }

    @Test
    void getRemindersByUser_ShouldReturnOnlyUserReminders() {
        User otherUser = userRepository.save(User.builder()
                .email("other-reminder@test.com").password("pass").name("Other").build());

        reminderRepository.save(Reminder.builder()
                .title("Mi recordatorio").dueDate(LocalDate.now()).user(testUser).build());
        reminderRepository.save(Reminder.builder()
                .title("Otro mio").dueDate(LocalDate.now().plusDays(1)).user(testUser).build());
        reminderRepository.save(Reminder.builder()
                .title("De otro").dueDate(LocalDate.now()).user(otherUser).build());

        List<Reminder> result = reminderService.getRemindersByUser(testUser.getEmail());

        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(r -> r.getUser().getId().equals(testUser.getId())));
    }

    @Test
    void getUnreadCount_ShouldCountOnlyUnread() {
        reminderRepository.save(Reminder.builder()
                .title("Leido").dueDate(LocalDate.now()).read(true).user(testUser).build());
        reminderRepository.save(Reminder.builder()
                .title("No leido 1").dueDate(LocalDate.now()).read(false).user(testUser).build());
        reminderRepository.save(Reminder.builder()
                .title("No leido 2").dueDate(LocalDate.now()).read(false).user(testUser).build());

        long count = reminderService.getUnreadCount(testUser.getEmail());

        assertEquals(2, count);
    }

    @Test
    void markAsRead_ShouldUpdateInDatabase() {
        Reminder saved = reminderRepository.save(Reminder.builder()
                .title("Pendiente").dueDate(LocalDate.now()).read(false).user(testUser).build());

        reminderService.markAsRead(testUser.getEmail(), saved.getId());

        Reminder found = reminderRepository.findById(saved.getId()).orElseThrow();
        assertTrue(found.isRead());
    }

    @Test
    void deleteReminder_ShouldRemoveFromDatabase() {
        Reminder saved = reminderRepository.save(Reminder.builder()
                .title("A eliminar").dueDate(LocalDate.now()).user(testUser).build());

        reminderService.deleteReminder(testUser.getEmail(), saved.getId());

        assertFalse(reminderRepository.findById(saved.getId()).isPresent());
    }

    @Test
    void getRemindersByUser_ShouldThrow_WhenUserNotFound() {
        assertThrows(ResponseStatusException.class,
                () -> reminderService.getRemindersByUser("no-existe@test.com"));
    }

    @Test
    void markAsRead_ShouldThrow_WhenReminderNotFound() {
        assertThrows(ResponseStatusException.class,
                () -> reminderService.markAsRead(testUser.getEmail(), 999L));
    }

    @Test
    void deleteReminder_ShouldThrow_WhenReminderNotFound() {
        assertThrows(ResponseStatusException.class,
                () -> reminderService.deleteReminder(testUser.getEmail(), 999L));
    }
}
