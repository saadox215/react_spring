package org.example.gherabi_projet.entities;

public class ModuleDTO {
    private Long id;
    private String code;
    private String nom;
    private String filiereNom;

    public ModuleDTO(Long id, String code, String nom, String filiereNom) {
        this.id = id;
        this.code = code;
        this.nom = nom;
        this.filiereNom = filiereNom;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
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
