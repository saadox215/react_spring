package org.example.gherabi_projet.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.Collection;

@Entity
@Table(name = "element")
@AllArgsConstructor
@NoArgsConstructor
public class Element {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private double coefficient;
    @Column(nullable = false)
    private boolean isValidated = false;

    public boolean isValidated() {
        return isValidated;
    }

    public void setValidated(boolean validated) {
        isValidated = validated;
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

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }

    public double getCoefficient() {
        return coefficient;
    }

    public void setCoefficient(double coefficient) {
        this.coefficient = coefficient;
    }

    public Professeur getProfesseur() {
        return professeur;
    }

    public void setProfesseur(Professeur professeur) {
        this.professeur = professeur;
    }

    public Collection<Evaluation> getEvaluation() {
        return evaluation;
    }

    public void setEvaluation(Collection<Evaluation> evaluation) {
        this.evaluation = evaluation;
    }

    public Collection<Absence> getAbsences() {
        return absences;
    }

    public void setAbsences(Collection<Absence> absences) {
        this.absences = absences;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "professeur_id", nullable = false)
    private Professeur professeur;

    @OneToMany(mappedBy = "element", cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonIgnore
    private Collection<Evaluation> evaluation;
    @OneToMany(mappedBy = "element", cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonIgnore
    private Collection<Absence> absences;

}
