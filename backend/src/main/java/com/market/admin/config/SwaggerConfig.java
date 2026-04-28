/**
 * Paquete de configuración de la aplicación.
 */
package com.market.admin.config;

// Importaciones de Swagger/OpenAPI para la documentación de la API
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
// Importaciones de Spring Framework para la configuración
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Clase de configuración para Swagger/OpenAPI.
 * Define la estructura y metadatos de la documentación de la API REST.
 */
@Configuration
public class SwaggerConfig {

    /**
     * Configura y personaliza el bean de OpenAPI.
     * Establece la información general de la API y configura la seguridad requerida (JWT).
     *
     * @return Instancia de OpenAPI configurada.
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            // Configuración de la información general de la API
            .info(new Info()
                .title("Administrador de Compras de Mercado")
                .version("1.0")
                .description("API REST para gestion de compras"))
            // Requisito de seguridad global para los endpoints (usando esquema bearerAuth)
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
            // Definición de los componentes de seguridad
            .components(new Components()
                .addSecuritySchemes("bearerAuth", new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("Pega tu token JWT aqui")));
    }
}