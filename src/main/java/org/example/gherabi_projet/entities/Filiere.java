package org.example.gherabi_projet.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "filiere")
@AllArgsConstructor
@NoArgsConstructor
public class Filiere {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String nom;
    private String description;


    private String imagePath;
    @Column(nullable = true)
    private String pdfPath;

    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getDescription() {
        return description;
    }

    public String getImagePath() {
        return imagePath;
    }

    public String getPdfPath() {
        return pdfPath;
    }

    public List<Module> getModules() {
        return modules;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public void setPdfPath(String pdfPath) {
        this.pdfPath = pdfPath;
    }

    public void setModules(List<Module> modules) {
        this.modules = modules;
    }

    @OneToMany(mappedBy = "filiere", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Module> modules;

}

