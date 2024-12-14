package org.example.gherabi_projet.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Table(name = "compte")
@AllArgsConstructor @NoArgsConstructor @Getter @Setter
public class Compte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String login;
    private String password;
    private String role;

    @ManyToOne
    @JoinColumn(name = "professeur_id", referencedColumnName = "id")
    private Professeur professeur;

}
