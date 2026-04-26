package com.market.admin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "reminders")
@Data
@NoArgsConstructor // Constructor sin parametros
@AllArgsConstructor // Constructor con todos los parametros
public class Reminder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto incremental
    private Long id;

    private String title;
    private String description;

    @Column(nullable = false) // no puede ser null
    private LocalDate dueDate;// fecha de vencimiento

    @Column(name = "is_read")
    private boolean read = false;// indica si el recordatorio ha sido leido

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // no puede ser null
    private User user;// relacion muchos a uno con User
}
