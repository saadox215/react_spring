package org.example.gherabi_projet.repository;

import org.example.gherabi_projet.entities.Element;
import org.example.gherabi_projet.entities.Professeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElementRepository extends JpaRepository<Element, Long> {
    List<Element> findByProfesseur(Professeur professeur);
}
