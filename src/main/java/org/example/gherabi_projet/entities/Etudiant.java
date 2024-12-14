package org.example.gherabi_projet.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "etudiant")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Etudiant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String nom;
    private String prenom;

    @OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL)
    private List<Evaluation> evaluations;



}
