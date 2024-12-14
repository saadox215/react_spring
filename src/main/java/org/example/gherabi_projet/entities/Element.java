package org.example.gherabi_projet.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "element")
public class Element {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private double coefficient;

    @ManyToOne
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

}
