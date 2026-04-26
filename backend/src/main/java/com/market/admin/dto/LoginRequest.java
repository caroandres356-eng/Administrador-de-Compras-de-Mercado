package com.market.admin.dto;

import lombok.Data;

/**
 * DTO para capturar los datos de inicio de sesión.
 */
@Data
public class LoginRequest {
    private String email;
    private String password;
}
