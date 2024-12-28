package org.example.gherabi_projet.dto;

public class ElementDTO {
    private Long id;
    private String nom;
    private String moduleNom;
    private double coefficient;
    private String ProfesseurNom;

    public ElementDTO(Long id, String nom, String moduleNom, double coefficient, String professeurNom) {
        this.id = id;
        this.nom = nom;
        this.moduleNom = moduleNom;
        this.coefficient = coefficient;
        ProfesseurNom = professeurNom;
    }

    public String getProfesseurNom() {
        return ProfesseurNom;
    }

    public void setProfesseurNom(String professeurNom) {
        ProfesseurNom = professeurNom;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getModuleNom() {
        return moduleNom;
    }

    public void setModuleNom(String moduleNom) {
        this.moduleNom = moduleNom;
    }

    public double getCoefficient() {
        return coefficient;
    }

    public void setCoefficient(double coefficient) {
        this.coefficient = coefficient;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
