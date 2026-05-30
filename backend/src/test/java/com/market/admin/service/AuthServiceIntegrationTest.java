package com.market.admin.service;

import com.market.admin.model.User;
import com.market.admin.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class AuthServiceIntegrationTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void register_ShouldPersistUser() {
        User user = new User();
        user.setEmail("newuser@test.com");
        user.setPassword("SecurePass123");
        user.setName("Nuevo Usuario");

        User saved = authService.register(user);

        assertNotNull(saved.getId());
        assertEquals("newuser@test.com", saved.getEmail());
        assertEquals("Nuevo Usuario", saved.getName());
        assertTrue(passwordEncoder.matches("SecurePass123", saved.getPassword()));

        User found = userRepository.findByEmail("newuser@test.com").orElseThrow();
        assertEquals("Nuevo Usuario", found.getName());
        assertTrue(passwordEncoder.matches("SecurePass123", found.getPassword()));
    }

    @Test
    void register_ShouldEncryptPassword() {
        User user = new User();
        user.setEmail("encrypt@test.com");
        user.setPassword("RawPass456");
        user.setName("Encrypt Test");

        User saved = authService.register(user);

        assertNotNull(saved.getId());
        assertNotEquals("RawPass456", saved.getPassword());
        assertTrue(saved.getPassword().startsWith("$2a$"));
        assertTrue(passwordEncoder.matches("RawPass456", saved.getPassword()));
    }

    @Test
    void login_ShouldReturnTokenAndProfile() {
        User user = new User();
        user.setEmail("logintest@test.com");
        user.setPassword("MyPassword1");
        user.setName("Login User");
        authService.register(user);

        Map<String, Object> result = authService.login("logintest@test.com", "MyPassword1");

        assertNotNull(result.get("token"));
        assertTrue(((String) result.get("token")).length() > 20);

        assertNotNull(result.get("user"));
        @SuppressWarnings("unchecked")
        Map<String, String> profile = (Map<String, String>) result.get("user");
        assertEquals("Login User", profile.get("name"));
        assertEquals("logintest@test.com", profile.get("email"));
    }

    @Test
    void login_ShouldThrow_WhenInvalidPassword() {
        User user = new User();
        user.setEmail("badpass@test.com");
        user.setPassword("CorrectPass1");
        user.setName("Test");
        authService.register(user);

        assertThrows(Exception.class,
                () -> authService.login("badpass@test.com", "WrongPass!"));
    }

    @Test
    void login_ShouldThrow_WhenUserNotFound() {
        assertThrows(Exception.class,
                () -> authService.login("noexiste@test.com", "pass123"));
    }
}
