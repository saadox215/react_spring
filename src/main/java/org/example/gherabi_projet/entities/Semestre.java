package org.example.gherabi_projet.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "semestre")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Semestre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String nom;

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

    @ManyToMany
    @JoinTable(
            name = "semestre_module",
            joinColumns = @JoinColumn(name = "semestre_id"),
            inverseJoinColumns = @JoinColumn(name = "module_id")
    )
    private List<Module> modules = new ArrayList<>();
}

