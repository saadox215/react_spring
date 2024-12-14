package org.example.gherabi_projet.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "module")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Module {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String nom;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL)
    private List<Element> elements;



    @ManyToOne
    @JoinColumn(name = "filiere_id", nullable = false)
    private Filiere filiere;

    @ManyToMany(mappedBy = "modules")
    private List<Professeur> professeurs;
    @ManyToMany(mappedBy = "modules")
    private List<Semestre> semestres = new ArrayList<>();

}
