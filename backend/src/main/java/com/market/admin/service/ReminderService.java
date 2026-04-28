/**
 * Paquete para la capa de servicios, donde reside la lógica de negocio.
 */
package com.market.admin.service;

// Importaciones de modelos y repositorios
import com.market.admin.model.Reminder;
import com.market.admin.model.User;
import com.market.admin.repository.ReminderRepository;
import com.market.admin.repository.UserRepository;
// Importaciones de Spring Framework
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// Importaciones utilitarias
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Servicio encargado de gestionar los recordatorios de compras.
 * Proporciona métodos para consultar, crear, marcar como leídos y eliminar recordatorios.
 */
@Service // Indica que esta clase es un servicio gestionado por Spring
public class ReminderService { // Clase que se encarga de la gestión de recordatorios

    @Autowired // Inyecta el repositorio de recordatorios
    private ReminderRepository reminderRepository;

    @Autowired // Inyecta el repositorio de usuarios
    private UserRepository userRepository;

    /**
     * Obtiene la lista completa de recordatorios de un usuario, ordenados por fecha.
     * 
     * @param email Correo electrónico del usuario autenticado.
     * @return Lista de recordatorios del usuario.
     */
    public List<Reminder> getRemindersByUser(String email) { // Obtiene los recordatorios del usuario
        // Busca al usuario en la BD
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")); // Lanza una excepcion si no existe
        
        // Retorna los recordatorios ordenados por fecha de vencimiento de más cercano a más lejano
        return reminderRepository.findByUserOrderByDueDateAsc(user); 
    }

    /**
     * Obtiene el número total de recordatorios que no han sido leídos.
     * 
     * @param email Correo electrónico del usuario.
     * @return Conteo de recordatorios no leídos.
     */
    public long getUnreadCount(String email) { // Obtiene el numero de recordatorios no leidos
        // Busca al usuario
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")); 
        
        // Retorna el número de recordatorios no leídos
        return reminderRepository.countByUserAndReadFalse(user); 
    }

    /**
     * Crea y persiste un nuevo recordatorio asociado al usuario.
     * 
     * @param email Correo electrónico del usuario autenticado.
     * @param data Mapa de datos enviados desde el frontend (title, description, dueDate).
     * @return El objeto Reminder creado.
     */
    public Reminder createReminder(String email, Map<String, String> data) { // Crea un nuevo recordatorio
        // Busca al usuario propietario
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")); 

        Reminder reminder = new Reminder(); // Crea un nuevo objeto recordatorio
        reminder.setTitle(data.get("title")); // Establece el titulo
        reminder.setDescription(data.getOrDefault("description", "")); // Establece la descripcion o vacio por defecto
        reminder.setDueDate(LocalDate.parse(data.get("dueDate"))); // Parsea y establece la fecha de vencimiento
        reminder.setRead(false); // Inicializa como no leido
        reminder.setUser(user); // Vincula al usuario

        return reminderRepository.save(reminder); // Guarda y retorna el recordatorio
    }

    /**
     * Marca un recordatorio específico como leído.
     * 
     * @param email Correo del usuario autenticado (para validación de permisos).
     * @param reminderId ID del recordatorio a actualizar.
     */
    public void markAsRead(String email, Long reminderId) { // Marca un recordatorio como leido
        // Busca al usuario
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")); 

        // Busca el recordatorio
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Recordatorio no encontrado")); 

        // Verifica que el recordatorio efectivamente pertenezca al usuario que lo intenta marcar
        if (reminder.getUser().getId().equals(user.getId())) { 
            reminder.setRead(true); // Actualiza estado
            reminderRepository.save(reminder); // Guarda cambios
        }
    }

    /**
     * Elimina un recordatorio de la base de datos.
     * 
     * @param email Correo del usuario autenticado.
     * @param reminderId ID del recordatorio a eliminar.
     */
    public void deleteReminder(String email, Long reminderId) { // Elimina un recordatorio
        // Busca al usuario
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")); 

        // Busca el recordatorio
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Recordatorio no encontrado")); 

        // Verifica permisos para borrar
        if (reminder.getUser().getId().equals(user.getId())) {
            reminderRepository.delete(reminder); // Elimina de DB
        }
    }
}
