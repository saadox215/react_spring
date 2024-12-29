package org.example.gherabi_projet.repository;

import org.example.gherabi_projet.entities.Absence;
import org.example.gherabi_projet.entities.Element;
import org.example.gherabi_projet.entities.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AbsenceRepository extends JpaRepository<Absence, Long> {
    List<Absence> findByEtudiantAndElement(Etudiant etudiant, Element element);
    long countByEtudiantAndElement(Etudiant etudiant, Element element);
}

