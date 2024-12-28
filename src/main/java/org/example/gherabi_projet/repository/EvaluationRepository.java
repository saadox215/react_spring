package org.example.gherabi_projet.repository;

import org.example.gherabi_projet.entities.Element;
import org.example.gherabi_projet.entities.Etudiant;
import org.example.gherabi_projet.entities.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByEtudiant(Etudiant etudiant);
}
