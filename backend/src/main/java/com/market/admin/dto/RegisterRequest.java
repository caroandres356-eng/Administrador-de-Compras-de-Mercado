package com.market.admin.dto;

import lombok.Data;

/**
 * DTO para el formulario de registro de nuevos usuarios.
 */
@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
}
