package org.example.gherabi_projet.dto;

import org.example.gherabi_projet.entities.Evaluation;
import org.example.gherabi_projet.entities.EvaluationType;

public class EvaluationDTO {
    private Long id;
    private String etudiantNom;
    private String etudiantPrenom;
    private String elementNom;
    private double note;
    private EvaluationType type;
    private int exam_absence;

    public EvaluationDTO(Evaluation evaluation) {
        this.id = evaluation.getId();
        this.etudiantNom = evaluation.getEtudiant().getNom();
        this.etudiantPrenom = evaluation.getEtudiant().getPrenom();
        this.elementNom = evaluation.getElement().getNom();
        this.note = evaluation.getNote();
        this.type = evaluation.getType();
        this.exam_absence = evaluation.getExam_absence();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEtudiantNom() {
        return etudiantNom;
    }

    public void setEtudiantNom(String etudiantNom) {
        this.etudiantNom = etudiantNom;
    }

    public String getEtudiantPrenom() {
        return etudiantPrenom;
    }

    public void setEtudiantPrenom(String etudiantPrenom) {
        this.etudiantPrenom = etudiantPrenom;
    }

    public String getElementNom() {
        return elementNom;
    }

    public void setElementNom(String elementNom) {
        this.elementNom = elementNom;
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

    public int getExam_absence() {
        return exam_absence;
    }

    public void setExam_absence(int exam_absence) {
        this.exam_absence = exam_absence;
    }
}
