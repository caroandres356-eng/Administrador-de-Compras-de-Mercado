package com.market.admin.service;

import com.market.admin.model.Reminder;
import com.market.admin.model.User;
import com.market.admin.repository.ReminderRepository;
import com.market.admin.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ReminderServiceTest {

    private ReminderRepository reminderRepository;
    private UserRepository userRepository;
    private ReminderService reminderService;
    private User testUser;

    @BeforeEach
    void setUp() {
        reminderRepository = mock(ReminderRepository.class);
        userRepository = mock(UserRepository.class);

        reminderService = new ReminderService();
        ReflectionTestUtils.setField(reminderService, "reminderRepository", reminderRepository);
        ReflectionTestUtils.setField(reminderService, "userRepository", userRepository);

        testUser = User.builder()
                .id(1L)
                .email("test@test.com")
                .name("Test User")
                .build();
    }

    @Test
    void getRemindersByUser_ShouldReturnReminders() {
        Reminder r1 = new Reminder();
        r1.setId(1L); r1.setTitle("Compra semanal"); r1.setUser(testUser);
        Reminder r2 = new Reminder();
        r2.setId(2L); r2.setTitle("Pagar servicios"); r2.setUser(testUser);
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(reminderRepository.findByUserOrderByDueDateAsc(testUser)).thenReturn(List.of(r1, r2));

        List<Reminder> result = reminderService.getRemindersByUser("test@test.com");

        assertEquals(2, result.size());
        assertEquals("Compra semanal", result.get(0).getTitle());
        verify(reminderRepository).findByUserOrderByDueDateAsc(testUser);
    }

    @Test
    void getRemindersByUser_ShouldThrow_WhenUserNotFound() {
        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> reminderService.getRemindersByUser("unknown@test.com"));
    }

    @Test
    void getUnreadCount_ShouldReturnCount() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(reminderRepository.countByUserAndReadFalse(testUser)).thenReturn(3L);

        long result = reminderService.getUnreadCount("test@test.com");

        assertEquals(3, result);
    }

    @Test
    void getUnreadCount_ShouldThrow_WhenUserNotFound() {
        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> reminderService.getUnreadCount("unknown@test.com"));
    }

    @Test
    void createReminder_ShouldCreateAndReturn() {
        Map<String, String> data = Map.of(
                "title", "Comprar fruta",
                "description", "Manzanas y naranjas",
                "dueDate", "2026-06-15"
        );
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(reminderRepository.save(any(Reminder.class))).thenAnswer(i -> i.getArgument(0));

        Reminder result = reminderService.createReminder("test@test.com", data);

        assertEquals("Comprar fruta", result.getTitle());
        assertEquals("Manzanas y naranjas", result.getDescription());
        assertEquals(LocalDate.of(2026, 6, 15), result.getDueDate());
        assertFalse(result.isRead());
        assertEquals(testUser, result.getUser());
        verify(reminderRepository).save(any(Reminder.class));
    }

    @Test
    void createReminder_ShouldSetDefaultDescription_WhenMissing() {
        Map<String, String> data = Map.of(
                "title", "Solo titulo",
                "dueDate", "2026-07-01"
        );
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(reminderRepository.save(any(Reminder.class))).thenAnswer(i -> i.getArgument(0));

        Reminder result = reminderService.createReminder("test@test.com", data);

        assertEquals("", result.getDescription());
    }

    @Test
    void createReminder_ShouldThrow_WhenUserNotFound() {
        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> reminderService.createReminder("unknown@test.com", Map.of()));
    }

    @Test
    void createReminder_ShouldThrow_WhenDueDateInvalid() {
        Map<String, String> data = Map.of(
                "title", "Test", "dueDate", "fecha-invalida"
        );
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));

        assertThrows(Exception.class,
                () -> reminderService.createReminder("test@test.com", data));
    }

    @Test
    void markAsRead_ShouldMarkReminderAsRead() {
        Reminder reminder = new Reminder();
        reminder.setId(1L); reminder.setTitle("Test"); reminder.setRead(false); reminder.setUser(testUser);
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(reminderRepository.findById(1L)).thenReturn(Optional.of(reminder));
        when(reminderRepository.save(any(Reminder.class))).thenAnswer(i -> i.getArgument(0));

        reminderService.markAsRead("test@test.com", 1L);

        assertTrue(reminder.isRead());
        verify(reminderRepository).save(reminder);
    }

    @Test
    void markAsRead_ShouldThrow_WhenUserNotFound() {
        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> reminderService.markAsRead("unknown@test.com", 1L));
    }

    @Test
    void markAsRead_ShouldThrow_WhenReminderNotFound() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(reminderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> reminderService.markAsRead("test@test.com", 99L));
    }

    @Test
    void markAsRead_ShouldDoNothing_WhenNotOwnedByUser() {
        User otherUser = User.builder().id(2L).email("other@test.com").build();
        Reminder reminder = new Reminder();
        reminder.setId(1L); reminder.setTitle("No es mia"); reminder.setRead(false); reminder.setUser(otherUser);
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(reminderRepository.findById(1L)).thenReturn(Optional.of(reminder));

        reminderService.markAsRead("test@test.com", 1L);

        assertFalse(reminder.isRead());
        verify(reminderRepository, never()).save(any());
    }

    @Test
    void deleteReminder_ShouldDelete() {
        Reminder reminder = new Reminder();
        reminder.setId(1L); reminder.setTitle("A eliminar"); reminder.setUser(testUser);
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(reminderRepository.findById(1L)).thenReturn(Optional.of(reminder));

        reminderService.deleteReminder("test@test.com", 1L);

        verify(reminderRepository).delete(reminder);
    }

    @Test
    void deleteReminder_ShouldThrow_WhenUserNotFound() {
        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> reminderService.deleteReminder("unknown@test.com", 1L));
    }

    @Test
    void deleteReminder_ShouldThrow_WhenReminderNotFound() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(reminderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> reminderService.deleteReminder("test@test.com", 99L));
    }

    @Test
    void deleteReminder_ShouldDoNothing_WhenNotOwnedByUser() {
        User otherUser = User.builder().id(2L).email("other@test.com").build();
        Reminder reminder = new Reminder();
        reminder.setId(1L); reminder.setTitle("No es mia"); reminder.setUser(otherUser);
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(reminderRepository.findById(1L)).thenReturn(Optional.of(reminder));

        reminderService.deleteReminder("test@test.com", 1L);

        verify(reminderRepository, never()).delete(any());
    }
}
