package org.example.gherabi_projet.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "evaluation")
@AllArgsConstructor
@NoArgsConstructor
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double note;
    @Enumerated(EnumType.STRING)
    private EvaluationType type;
    private int exam_absence;


    public int getExam_absence() {
        return exam_absence;
    }

    public void setExam_absence(int exam_absence) {
        this.exam_absence = exam_absence;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }



    public Etudiant getEtudiant() {
        return etudiant;
    }

    public void setEtudiant(Etudiant etudiant) {
        this.etudiant = etudiant;
    }

    public double getNote() {
        return note;
    }

    public void setNote(double note) {
        this.note = note;
    }


    public EvaluationType getType() {
        return type;
    }

    public void setType(EvaluationType type) {
        this.type = type;
    }

    public Element getElement() {
        return element;
    }

    public void setElement(Element element) {
        this.element = element;
    }

    @ManyToOne
    @JoinColumn(name = "etudiant_id", referencedColumnName = "id")
    @JsonIgnore
    private Etudiant etudiant;

    @ManyToOne
    @JoinColumn(name = "element_id", referencedColumnName = "id")
    @JsonBackReference("element-evaluation")
    private Element element;
}
