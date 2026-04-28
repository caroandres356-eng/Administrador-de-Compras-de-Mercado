/**
 * Paquete principal de la aplicación.
 */
package com.market.admin;

// Importaciones de Spring Boot necesarias para iniciar la aplicación
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal que inicializa la aplicación Spring Boot.
 * La anotación @SpringBootApplication configura automáticamente el contexto de Spring,
 * escanea los componentes y habilita la autoconfiguración.
 */
@SpringBootApplication
public class MarketAdminApplication {

    /**
     * Punto de entrada principal de la aplicación.
     * 
     * @param args Argumentos de línea de comandos pasados durante el inicio.
     */
	public static void main(String[] args) { // punto de entrada de la aplicacion
		SpringApplication.run(MarketAdminApplication.class, args);
	}

}
