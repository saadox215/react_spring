package org.example.gherabi_projet.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;

@Entity
@Table(name = "compte")
@AllArgsConstructor @NoArgsConstructor
public class Compte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String login;
    private String password;
    private String role;
    private String validationCode;
    private LocalDateTime validationCodeExpiration;

    @OneToOne
    @JoinColumn(name = "professeur_id", referencedColumnName = "id")
    @JsonBackReference
    private Professeur professeur;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getValidationCode() {
        return validationCode;
    }

    public void setValidationCode(String validationCode) {
        this.validationCode = validationCode;
    }

    public LocalDateTime getValidationCodeExpiration() {
        return validationCodeExpiration;
    }

    public void setValidationCodeExpiration(LocalDateTime validationCodeExpiration) {
        this.validationCodeExpiration = validationCodeExpiration;
    }

    public Professeur getProfesseur() {
        return professeur;
    }

    public void setProfesseur(Professeur professeur) {
        this.professeur = professeur;
    }
}