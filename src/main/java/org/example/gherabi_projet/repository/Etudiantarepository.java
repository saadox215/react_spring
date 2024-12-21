package org.example.gherabi_projet.repository;

import org.example.gherabi_projet.entities.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Etudiantarepository extends JpaRepository<Etudiant, Long> {

}
