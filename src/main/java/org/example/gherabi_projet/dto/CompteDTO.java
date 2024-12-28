package org.example.gherabi_projet.dto;

import org.example.gherabi_projet.entities.Compte;

public class CompteDTO {
    private Long id;
    private String login;
    private String role;
    private ProfesseurDTO professeur;


    public CompteDTO(Long id, String login, String role, ProfesseurDTO professeur) {
        this.id = id;
        this.login = login;
        this.role = role;
        this.professeur = professeur;
    }

    public CompteDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public ProfesseurDTO getProfesseur() {
        return professeur;
    }

    public void setProfesseur(ProfesseurDTO professeur) {
        this.professeur = professeur;
    }

    public static CompteDTO fromEntity(Compte compte) {
        CompteDTO dto = new CompteDTO();
        dto.setId(compte.getId());
        dto.setLogin(compte.getLogin());
        dto.setRole(compte.getRole());
        if (compte.getProfesseur() != null) {
            dto.setProfesseur(ProfesseurDTO.fromEntity(compte.getProfesseur()));
        }
        return dto;
    }
}