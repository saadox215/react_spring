package org.example.gherabi_projet.dto;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import org.example.gherabi_projet.entities.SemesterType;

public class ModuleDTO {
    private Long id;
    private String nom;
    private String filiereNom;
    @Enumerated(EnumType.STRING)
    @Column(name = "semester_type")
    private SemesterType semesterType;


    public ModuleDTO(Long id, String nom, String filiereNom, SemesterType semesterType) {
        this.id = id;
        this.nom = nom;
        this.filiereNom = filiereNom;
        this.semesterType = semesterType;
    }

    public SemesterType getSemesterType() {
        return semesterType;
    }

    public void setSemesterType(SemesterType semesterType) {
        this.semesterType = semesterType;
    }

    public Long getId() {
        return id;
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

    public String getFiliereNom() {
        return filiereNom;
    }

    public void setFiliereNom(String filiereNom) {
        this.filiereNom = filiereNom;
    }
}
