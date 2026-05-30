package com.market.admin.service;

import com.market.admin.model.User;
import com.market.admin.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class UserServiceIntegrationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void updateProfile_ShouldUpdateName() {
        userRepository.save(User.builder()
                .email("profile@test.com")
                .password("pass")
                .name("Original Name")
                .build());

        Map<String, String> body = new HashMap<>();
        body.put("name", "Updated Name");
        Map<String, Object> result = userService.updateProfile("profile@test.com", body);

        assertEquals("Updated Name", result.get("name"));

        User found = userRepository.findByEmail("profile@test.com").orElseThrow();
        assertEquals("Updated Name", found.getName());
    }

    @Test
    void updateProfile_ShouldUpdateAvatar() {
        userRepository.save(User.builder()
                .email("avatar@test.com")
                .password("pass")
                .name("Avatar Test")
                .build());

        Map<String, String> body = new HashMap<>();
        body.put("avatar", "https://example.com/avatar.jpg");
        Map<String, Object> result = userService.updateProfile("avatar@test.com", body);

        assertEquals("https://example.com/avatar.jpg", result.get("avatar"));

        User found = userRepository.findByEmail("avatar@test.com").orElseThrow();
        assertEquals("https://example.com/avatar.jpg", found.getAvatar());
    }

    @Test
    void updateProfile_ShouldUpdateNameAndAvatar() {
        userRepository.save(User.builder()
                .email("both@test.com")
                .password("pass")
                .name("Old Name")
                .build());

        Map<String, String> body = new HashMap<>();
        body.put("name", "New Name");
        body.put("avatar", "https://example.com/new-avatar.png");
        Map<String, Object> result = userService.updateProfile("both@test.com", body);

        assertEquals("New Name", result.get("name"));
        assertEquals("https://example.com/new-avatar.png", result.get("avatar"));
    }

    @Test
    void updateProfile_ShouldIgnoreBlankName() {
        userRepository.save(User.builder()
                .email("blank@test.com")
                .password("pass")
                .name("Keep This Name")
                .build());

        Map<String, String> body = new HashMap<>();
        body.put("name", "   ");
        Map<String, Object> result = userService.updateProfile("blank@test.com", body);

        assertEquals("Keep This Name", result.get("name"));
    }

    @Test
    void updateProfile_ShouldNotChangeName_WhenNotInBody() {
        userRepository.save(User.builder()
                .email("nokey@test.com")
                .password("pass")
                .name("Original")
                .avatar("old-avatar")
                .build());

        Map<String, String> body = new HashMap<>();
        body.put("avatar", "new-avatar");
        Map<String, Object> result = userService.updateProfile("nokey@test.com", body);

        assertEquals("Original", result.get("name"));
        assertEquals("new-avatar", result.get("avatar"));
    }

    @Test
    void updateProfile_ShouldSetEmptyAvatar_WhenNullInBody() {
        userRepository.save(User.builder()
                .email("nullavatar@test.com")
                .password("pass")
                .name("Test")
                .build());

        Map<String, String> body = new HashMap<>();
        body.put("avatar", null);
        Map<String, Object> result = userService.updateProfile("nullavatar@test.com", body);

        assertEquals("", result.get("avatar"));
    }

    @Test
    void updateProfile_ShouldThrow_WhenUserNotFound() {
        Map<String, String> body = new HashMap<>();
        body.put("name", "Any Name");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> userService.updateProfile("noexiste@test.com", body));
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void updateProfile_ShouldReturnEmail() {
        userRepository.save(User.builder()
                .email("emailcheck@test.com")
                .password("pass")
                .name("Test User")
                .build());

        Map<String, String> body = new HashMap<>();
        body.put("name", "Updated");
        Map<String, Object> result = userService.updateProfile("emailcheck@test.com", body);

        assertEquals("emailcheck@test.com", result.get("email"));
    }
}
