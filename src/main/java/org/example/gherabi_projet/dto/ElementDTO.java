package org.example.gherabi_projet.dto;

public class ElementDTO {
    private Long id;
    private String nom;
    private String moduleNom;
    private Long moduleId;
    private double coefficient;
    private String professeurNom;
    private Long professeurId;

    public ElementDTO(Long id, String nom, String moduleNom, Long moduleId,
                      double coefficient, String professeurNom, Long professeurId) {
        this.id = id;
        this.nom = nom;
        this.moduleNom = moduleNom;
        this.moduleId = moduleId;
        this.coefficient = coefficient;
        this.professeurNom = professeurNom;
        this.professeurId = professeurId;
    }


    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

    public String getProfesseurNom() {
        return professeurNom;
    }

    public void setProfesseurNom(String professeurNom) {
        this.professeurNom = professeurNom;
    }

    public Long getProfesseurId() {
        return professeurId;
    }

    public void setProfesseurId(Long professeurId) {
        this.professeurId = professeurId;
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
