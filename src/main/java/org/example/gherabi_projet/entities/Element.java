package org.example.gherabi_projet.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Table(name = "element")
public class Element implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private double coefficient;

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

    public double getCoefficient() {
        return coefficient;
    }

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }

    public Professeur getProfeseur() {
        return professeur;
    }

    public void setProfeseur(Professeur profeseur) {
        this.professeur = profeseur;
    }

    public void setCoefficient(double coefficient) {
        this.coefficient = coefficient;
    }

    @ManyToOne
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;
    @ManyToOne
    @JoinColumn(name = "professeur_id", nullable = true)
    private Professeur professeur;

}
