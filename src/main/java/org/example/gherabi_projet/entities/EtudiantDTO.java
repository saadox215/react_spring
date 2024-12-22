package org.example.gherabi_projet.entities;

public class EtudiantDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String filiereNom;
    private Long filiereId;


    public Long getFiliereId() {
        return filiereId;
    }

    public void setFiliereId(Long filiereId) {
        this.filiereId = filiereId;
    }


    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public EtudiantDTO( Long id, String nom,String prenom, String filiereNom, Long filiereId) {
        this.filiereNom = filiereNom;
        this.filiereId = filiereId;
        this.prenom = prenom;
        this.nom = nom;
        this.id = id;
    }

    // Getters et Setters (si nécessaire)
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
