package org.example.gherabi_projet.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "evaluation")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private double note;
    private String type;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "eval_type_id", referencedColumnName = "id")
    private EvalType evalType;

    @ManyToOne
    @JoinColumn(name = "etudiant_id", referencedColumnName = "id")
    private Etudiant etudiant;
}
