package org.example.gherabi_projet.dto;

import org.example.gherabi_projet.entities.Professeur;

public class ProfesseurDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String specialite;


    public Long getId() {
        return id;
    }

    public ProfesseurDTO() {
    }

    public ProfesseurDTO(Long id, String nom, String prenom, String specialite) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.specialite = specialite;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getSpecialite() {
        return specialite;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public static ProfesseurDTO fromEntity(Professeur professeur) {
        ProfesseurDTO dto = new ProfesseurDTO();
        dto.setId(professeur.getId());
        dto.setNom(professeur.getNom());
        dto.setPrenom(professeur.getPrenom());
        dto.setSpecialite(professeur.getSpecialite());
        return dto;
    }
}
